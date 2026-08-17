import React from "react";
import CheckoutWizard from "../../../../../../components/Checkout/CheckoutWizard";
import { useLocation } from "react-router-dom";

/**
 * 📍 صفحة إتمام الحجز والدفع (Status / Checkout Page)
 * تم دمج شاشات بوابة الدفع الأربعة للربط المباشر بطلب المستخدم
 */
const Status = () => {
  const location = useLocation();

  // الحصول على بيانات الرحلة المرسلة إن وجدت من صفحة الحجز
  const passedBookingData = location.state || {
    bookingId: "NF-8829-Luxor",
    title: "Giza Pyramids Private Trip",
    date: "Oct 24, 2023",
    time: "09:00 AM",
    adults: 2,
    baseRate: 240.0,
    guideFee: 45.0,
    transportFee: 30.0,
    totalAmount: 315.0,
  };

  return <CheckoutWizard initialData={passedBookingData} />;
};

export default Status;
