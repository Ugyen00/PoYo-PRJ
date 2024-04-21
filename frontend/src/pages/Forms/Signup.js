import React,{useState} from 'react'
import { Link } from 'react-router-dom';
import Navbar from '../../components/NavBar'
import image1 from '../../utils/images/pg.png';

const SignUp = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dob: '',
    password: '',
    confirmPassword: ''
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div>
        <Navbar/>

    <div className="flex flex-col md:flex-row justify-center items-center">
    <div className="md:w-1/2 p-6 order-1">
      <img src={image1} alt="img" className="h-auto " />
    </div>

      <div className="md:w-1/2 p-6 order-1 mr-8">
        <p className="mb-5 font-bold text-xl">Welcome</p>
        <p></p>
        <p className="mb-9">Welcome new User! Please enter your details</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="fullName" className="block mb-1">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-2/4 border border-gray-300 rounded py-2 px-3 focus:outline-none focus:border-blue-500"
              required
            />
          </div>
      
          <div>
            <label htmlFor="email" className="block mb-1">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-2/4 border border-gray-300 rounded py-2 px-3 focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="phone" className="block mb-1">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-2/4 border border-gray-300 rounded py-2 px-3 focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="dob" className="block mb-1">Date of Birth</label>
            <input
              type="date"
              id="dob"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className="w-2/4 border border-gray-300 rounded py-2 px-3 focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-1">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-2/4 border border-gray-300 rounded py-2 px-3 focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block mb-1">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-2/4 border border-gray-300 rounded py-2 px-3 focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <button type="submit" className="w-2/4 bg-green-800 text-white py-2 px-4 rounded hover:bg-green-900 focus:outline-none focus:bg-blue-600">
            Sign Up
          </button>
        </form>
        <p className="mt-4">Have an account? <Link to="/login" className="text-red-500">Sign in</Link></p>
      </div>
    </div>
    </div>
  );
};

export default SignUp;

