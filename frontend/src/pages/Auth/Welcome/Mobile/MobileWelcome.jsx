import { useNavigate } from "react-router-dom";
import styles from "../Welcome.module.css";
import travelerImg from "../../../../assets/images/auth/traveler.jpg";
import guideImg from "../../../../assets/images/auth/tour-guide.png";
import Icons from "../../../../assets/icons";
import LogoDark from "../../../../assets/images/Logo_Dark.png";
import {Button} from '../../../../components/ui/button'
import {useState} from 'react'

const roles = [
  {
    id: 1,
    title: "Traveler",
    role: "tourist",
    desc: "Discover curated trips and book with clear prices.",
    cta: "Continue as Traveler",
    img: travelerImg,
  },
  {
    id: 2,
    title: "Trip Guide",
    role: "guide",
    desc: "Create tours, manage bookings, and grow your business.",
    cta: "Continue as Guide",
    img: guideImg,
  },
];

export default function MobileWelcome() {
  const navigate = useNavigate();

  const [role, setRole] = useState('')
  const [submit, setSubmit] = useState(false)
  const [error, setError] = useState(false)

  const handleSubmit = (role) => {
    if(submit){
      navigate(`/auth/register?role=${role}`);
    }else{
      setError(true)
    }
  };

  const handleRole = (role)=> {
    setRole(role)
    console.log(role)
    setSubmit(true)
  }

  // const handleLogin = () => {
  //   navigate("/auth/login");
  // };


  return (
    <div className={styles.main}>
      <div className={styles.header}>
        <h1>Welcome</h1>
      </div>
      <div className={styles.body}>
        <div className={styles.label}>
          <p>Choose what suits you</p>
        </div>
        <div className={styles.cards}>
          <div className={`${styles.card} ${role === "tourist"?styles.selected:''}`} onClick={()=>handleRole('tourist')}>
            <div className={styles.select}>
              {role === "tourist"?<Icons.CheckCircle/>:<></>}
            </div>
            <Icons.case className={styles.icon}/>
            <h2 className={styles.cardTitle}>I am a Traveler</h2>
            <p className={styles.cardSubTitle}>Looking for experiences</p>
          </div>
          <div className={styles.card} className={`${styles.card} ${role === "guide"?styles.selected:''}`} onClick={()=>handleRole('guide')}>
            <div className={styles.select}>
              {role === "guide"?<Icons.CheckCircle/>:<></>}
            </div>
            <Icons.compass className={styles.icon}/>
            <h2 className={styles.cardTitle}>I am a Local Guide</h2>
            <p className={styles.cardSubTitle}>Ready to host tours</p>
          </div>
          {error ?<p style={{color:"red"}}>Please choose a role first</p>:<></>}
          <button className={styles.button} onClick={handleSubmit}>Get Started</button>
        </div>
      </div>
    </div>
    // <main className={styles.page}>
    //   <section className={styles.mainGrid}>
    //     <div className={styles.contentSide}>
    //       <img src={LogoDark} alt="Nefru" className={styles.mobileLogo} />

    //       <div className={styles.copyBlock}>
    //         <h2 className={styles.subtitle}>
    //           Choose how you want to explore <span>Egypt</span>
    //         </h2>
    //         <p className={styles.description}>
    //           Find trusted local tours, clear prices, and unforgettable Egyptian
    //           experiences from verified guides.
    //         </p>
    //       </div>

    //       <div className={styles.cards} aria-label="Choose account type">
    //         {roles.map((item) => (
    //           <button
    //             key={item.id}
    //             type="button"
    //             className={styles.roleCard}
    //             onClick={() => handleChooseRole(item.role)}
    //           >
    //             <img src={item.img} alt="" className={styles.cardImg} />

    //             <div className={styles.cardOverlay} />

    //             <div className={styles.cardContent}>
    //               <h3>{item.title}</h3>
    //               <p>{item.desc}</p>

    //               <span className={styles.cardCta}>
    //                 {item.cta}
    //                 <Icons.ArrowRight />
    //               </span>
    //             </div>
    //           </button>
    //         ))}
    //       </div>

    //       <div className={styles.mobileLoginBlock}>
    //         <button className={styles.loginButton} type="button" onClick={handleLogin}>
    //           Login
    //         </button>

    //         <div className={styles.mobileSocials} aria-label="Social links">
    //           <a href="#" aria-label="Facebook">
    //             <Icons.Facebook />
    //           </a>
    //           <a href="#" aria-label="Twitter X">
    //             <Icons.Twitter />
    //           </a>
    //         </div>

    //         <p>Unveiling the Timeless Wonders of the Nile.</p>
    //       </div>
    //     </div>
    //   </section>

    // </main>
  );
}
