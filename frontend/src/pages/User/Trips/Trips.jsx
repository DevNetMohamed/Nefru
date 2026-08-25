import { Link } from "react-router-dom";

const Trips = () => {
  return (
    <>
      <p>trips</p>
      <Link to="/user/home">home</Link>
      <Link to="/user/trips">trips</Link>
      <Link to="/user/saved">saved</Link>
      <Link to="/user/profile">profile</Link>
      <Link to="/user/trips/info">info</Link>
    </>
  );
};

export default Trips;
