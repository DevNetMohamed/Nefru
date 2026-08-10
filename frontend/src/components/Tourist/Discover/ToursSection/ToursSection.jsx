import styles from "./ToursSection.module.css";

import TourCard from "../TourCard/TourCard";

//import images for the tours

import pyramidsImage from "../../../../assets/images/tours/pyramids.webp";
import luxorImage from "../../../../assets/images/tours/Luxor.jpg";
import khanImage from "../../../../assets/images/tours/khan-el-khalili.jpg";

function ToursSection({ searchQuery }) {
    // console.log("ToursSection Rendered");
    const tours = [

        {
            id: 1,
            title: "Giza Pyramids Half-Day Trip",
            duration: "4 Hours",
            price: 45,
            image: pyramidsImage,
        },

        {
            id: 2,
            title: "Luxor East Bank Trip",
            duration: "6 Hours",
            price: 65,
            image: luxorImage,
        },

        {
            id: 3,
            title: "Khan El Khalili Food Experience",
            duration: "3 Hours",
            price: 35,
            image: khanImage,
        },

    ];

    const filteredTours = tours.filter((trip) =>

        trip.title
            .toLowerCase()
            .includes(searchQuery.toLowerCase())

    );

    return (

        <section className={styles.section}>

            <div className={styles.header}>

                <h2>Tours</h2>

                <button>
                    View all
                </button>

            </div>

            <div className={styles.tours}>

                {filteredTours.map((trip) => (

                    <TourCard
                        key={trip.id}
                        trip={trip}
                    />

                ))}

            </div>

            {filteredTours.length === 0 && (

                <p>
                    No tours found.
                </p>

            )}

        </section>

    );
}

export default ToursSection;