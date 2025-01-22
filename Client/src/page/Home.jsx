import  { useState, useEffect } from 'react';
import { TypeAnimation } from 'react-type-animation';
import { Link } from 'react-router-dom';

const Home = () => {
    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentDate(new Date());
        }, 1000); // Update every second

        return () => clearInterval(intervalId); // Clean up on unmount
    }, []);

    const formatDate = (date) => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    };

    return (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 min-h-screen py-20 px-6 sm:px-12 lg:px-24 flex flex-col justify-center items-center">
            <div className="max-w-4xl w-full text-center">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6">
                    Welcome to{' '}
                    <span className="text-blue-600 dark:text-indigo-400">AbcBlog</span>
                </h1>
                <div className="text-2xl md:text-3xl font-medium text-gray-700 dark:text-gray-300 mb-8">
                    <TypeAnimation
                        sequence={[
                            'Sharing Knowledge',
                            1000, // Wait 1s
                            'Inspiring Creativity',
                            1000,
                            'Exploring New Ideas',
                            1000,
                        ]}
                        wrapper="span"
                        repeat={Infinity}
                    />
                </div>
                <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-12 leading-relaxed">
                    A space for thoughts, experiences, and discoveries. Join me on this journey of learning and growth.
                </p>
                <div className="flex space-x-4 justify-center">
                    <Link to="/projects" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-indigo-500">
                        View Projects
                    </Link>
                    <Link to="/about" className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-700 text-base font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:focus:ring-gray-600">
                        Learn More
                    </Link>
                </div>
                <p className="mt-12 text-gray-500 dark:text-gray-500 text-sm">
                    {formatDate(currentDate)}
                </p>
            </div>
        </div>
    );
};

export default Home;