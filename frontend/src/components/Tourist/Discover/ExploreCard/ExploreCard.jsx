import styles from "./ExploreCard.module.css";
import { LuChevronRight } from "react-icons/lu";

function ExploreCard({ blog }) {
    return (
        <div className={styles.card}>

            <img
                src={blog.image}
                alt={blog.title}
                className={styles.image}
            />

            <div className={styles.content}>

                <span className={styles.date}>
                    {blog.date}
                </span>

                <h3 className={styles.title}>
                        <LuChevronRight
                            className={styles.arrow}
                        />
                    {blog.title}
                </h3>

                <div className={styles.footer}>

                    <div className={styles.tags}>

                        {blog.tags.map((tag) => (

                            <span
                                key={tag}
                                className={styles.tag}
                            >
                                {tag}
                            </span>

                        ))}

                    </div>


                </div>

            </div>

        </div>
    );
}

export default ExploreCard;