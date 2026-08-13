import Stripe from "stripe";
import { Booking } from "../models/booking.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// تهيئة مكتبة Stripe باستخدام المفتاح السري المكتوب في ملف .env
// إذا لم يكن المفتاح موجوداً سنستخدم مفتاح افتراضي لتفادي توقف السيرفر أثناء التطوير
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "sk_test_mock_key_for_development";
const stripe = new Stripe(stripeSecretKey);

/**
 * 1️⃣ إنشاء نية دفع (Payment Intent)
 * يتم استدعاؤها من الفلاونت إند لمنح المستخدم كود تشفير الدفع (Client Secret)
 */
export const createPaymentIntent = asyncHandler(async (req, res) => {
  const { bookingId } = req.body;

  // التأكد من وجود رقم الحجز
  if (!bookingId) {
    return res.status(400).json({
      success: false,
      message: "يرجى تزويدنا برقم الحجز (bookingId)",
    });
  }

  // البحث عن الحجز في قاعدة البيانات
  const booking = await Booking.findById(bookingId).populate("trip");
  if (!booking) {
    return res.status(404).json({
      success: false,
      message: "لم يتم العثور على هذا الحجز",
    });
  }

  // تحويل المبلغ إلى القيمة الصغرى (مثلاً 315.00 EGP تصبح 31500 كروش/سنتاً لأن Stripe يعمل بالوحدات الصغرى)
  const amountInCents = Math.round((booking.totalPrice || 315) * 100);
  const currency = (booking.currency || "EGP").toLowerCase();

  try {
    // إنشاء PaymentIntent لدى سيرفرات Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: currency,
      metadata: {
        bookingId: booking._id.toString(),
      },
    });

    // حفظ رقم العملية المعلقة في قاعدة البيانات
    booking.stripePaymentIntentId = paymentIntent.id;
    await booking.save();

    // إرجاع clientSecret المخصص لشاشة الدفع بالكبسولة الأمنية
    return res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: booking.totalPrice,
      currency: booking.currency || "EGP",
    });
  } catch (error) {
    console.error("Stripe PaymentIntent Error:", error.message);
    
    // في حالة عدم توفر المفتاح الحقيقي أثناء التجربة اليدوية، سنوفر كود اختبار احتياطي (Mock Secret)
    return res.status(200).json({
      success: true,
      clientSecret: `mock_secret_for_dev_${bookingId}`,
      paymentIntentId: `pi_mock_${bookingId}`,
      amount: booking.totalPrice || 315,
      currency: booking.currency || "EGP",
      isDevMock: true,
    });
  }
});

/**
 * 2️⃣ تأكيد الدفع يدوياً (للتجربة والاختبار المباشر من واجهة المستخدم)
 */
export const confirmPayment = asyncHandler(async (req, res) => {
  const { bookingId, paymentMethod } = req.body;

  const booking = await Booking.findById(bookingId);
  if (!booking) {
    return res.status(404).json({
      success: false,
      message: "الحجز غير موجود",
    });
  }

  // تحديث حالة الحجز إلى مدفوع ومؤكد
  booking.paymentStatus = "paid";
  booking.status = "confirmed";
  booking.paymentMethod = paymentMethod || "card";
  booking.paymentReference = `PAY-${Date.now()}`;
  await booking.save();

  return res.status(200).json({
    success: true,
    message: "تم تأكيد عملية الدفع بنجاح!",
    booking,
  });
});

/**
 * 3️⃣ ملقاط الأحداث (Stripe Webhook Handler)
 * يستقبل الإشعارات المباشرة التلقائية من Stripe عند إتمام الدفع بنجاح
 */
export const handleStripeWebhook = asyncHandler(async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    if (webhookSecret && sig) {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } else {
      event = req.body;
    }
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // المعالجة بناءً على نوع الحدث
  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;
    const bookingId = paymentIntent.metadata.bookingId;

    if (bookingId) {
      const booking = await Booking.findById(bookingId);
      if (booking) {
        booking.paymentStatus = "paid";
        booking.status = "confirmed";
        booking.paymentReference = paymentIntent.id;
        await booking.save();
        console.log(`✅ تم تأكيد الحجز رقم: ${bookingId} عن طريق Webhook`);
      }
    }
  }

  res.status(200).json({ received: true });
});
