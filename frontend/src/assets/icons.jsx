import { GoHome } from "react-icons/go";
import { HiOutlineUser, HiOutlineHeart } from "react-icons/hi";
import { MdEventRepeat, MdOutlineCardTravel } from "react-icons/md";
import {
  AiOutlineArrowRight,
  AiOutlineGoogle,
  AiFillFacebook,
} from "react-icons/ai";
import { RiTwitterXFill } from "react-icons/ri";
import { BsFillEnvelopeFill } from "react-icons/bs";
import { FaHourglassHalf } from "react-icons/fa";
import { CiUser, CiMail, CiLock } from "react-icons/ci";
import { GiPassport } from "react-icons/gi";
import { IoMdCheckbox, IoMdShare, IoMdSunny } from "react-icons/io";
import { FaCheckSquare } from "react-icons/fa";
import { FaCheckCircle, FaEye, FaEyeSlash } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import { BsPersonHearts } from "react-icons/bs";
import { FaRegCalendarCheck } from "react-icons/fa";
import { LuTicket } from "react-icons/lu";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { LuSunrise } from "react-icons/lu";
import { BsCashStack } from "react-icons/bs";
import { IoIosSearch, IoMdArrowDropdown,IoMdArrowDropup  } from "react-icons/io";
import { FaStar } from "react-icons/fa6";
import { IoArrowBack, IoCloseCircleOutline } from "react-icons/io5";
import { IoIosArrowBack, IoIosArrowForward, IoIosArrowDown } from "react-icons/io";
import { LuLayoutDashboard } from "react-icons/lu";
import { CiLocationOn } from "react-icons/ci";
import { HiOutlineUsers } from "react-icons/hi2";
import { IoAnalytics } from "react-icons/io5";
import { AiOutlineSchedule } from "react-icons/ai";
import { MdContentCopy } from "react-icons/md";
import { GoBell } from "react-icons/go";
import { BsSuitcase } from "react-icons/bs";
import { FaCompass } from "react-icons/fa";
/**
 * Centralized Icon Registry
 * Use these variables throughout the app for consistency.
 */
const Icons = {
  Home: GoHome,
  Layout:LuLayoutDashboard,
  Profile: HiOutlineUser,
  compass:FaCompass,
  Trips: MdOutlineCardTravel,
  Notification:GoBell,
  Saved: HiOutlineHeart,
  ArrowRight: AiOutlineArrowRight,
  arrowDown:IoMdArrowDropdown,
  arrowUp:IoMdArrowDropup,
  Google: AiOutlineGoogle,
  Facebook: AiFillFacebook,
  Twitter: RiTwitterXFill,
  CheckCircle: FaCheckCircle,
  Eye: FaEye,
  Analytics:IoAnalytics,
  Book:AiOutlineSchedule,
  Copy:MdContentCopy,
  EyeSlash: FaEyeSlash,
  EmailOutline: MdOutlineEmail,
  HourglassHalf: FaHourglassHalf,
  Check: FaCheckSquare,
  Email_fill: BsFillEnvelopeFill,
  User: CiUser,
  Users:HiOutlineUsers,
  Lock: CiLock,
  Passport: GiPassport,
  Checkbox: IoMdCheckbox,
  Email: CiMail,
  Guest: BsPersonHearts,
  sun: IoMdSunny,
  event: MdEventRepeat,
  afternoon: LuSunrise,
  ticket:LuTicket,
  circleCheck:IoIosCheckmarkCircleOutline,
  circleWrong:IoCloseCircleOutline,
  cash:BsCashStack,
  search:IoIosSearch,
  star:FaStar,
  back: IoArrowBack,
  share: IoMdShare,
  chevronLeft:IoIosArrowBack,
  chevronRight:IoIosArrowForward ,
  chevronDown:IoIosArrowDown,
  Location:CiLocationOn,
  case:BsSuitcase,
  // Add more icons as needed for the tourist/guide platform
};
export default Icons;
