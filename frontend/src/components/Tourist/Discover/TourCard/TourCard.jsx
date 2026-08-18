import React from "react";
import styles from "./TourCard.module.css";

import { LuClock3, LuChevronRight } from "react-icons/lu";
import { PiMoney } from "react-icons/pi";

const TourCard = ({ trip }) => {
    if (!trip) return null;

    // debugging
    // console.log("TOUR CARD RENDERED");
    // console.log(trip);

    return (
        <div className={styles.card}>
            <img src={trip.image} alt={trip.title} className={styles.image} />

            <div className={styles.content}>
                <h3 className={styles.title}>{trip.title}</h3>

                <div className={styles.info}>
                    <span>
                        <LuClock3 />
                        {trip.duration}
                    </span>

                    <span>
                        <PiMoney />
                        ${trip.price}
                    </span>
                </div>
            </div>

            <button className={styles.detailsButton}>
                Detail<LuChevronRight />
            </button>
        </div>
    );
};

export default TourCard;