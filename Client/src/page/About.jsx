
import  { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const About = () => {
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => setIsHovered(true), 500); // Animation after 0.5s
    return () => clearTimeout(timeoutId);
  }, []);

  const socialLinks = [
    {
      icon: 'fa-brands fa-github',
      link: 'https://github.com/your-username', // Replace with your actual links
    },
    {
      icon: 'fa-brands fa-twitter',
      link: 'https://twitter.com/your-username',
    },
    {
      icon: 'fa-brands fa-linkedin',
      link: 'https://www.linkedin.com/in/your-username',
    },
    // Add more social links as needed
  ];

  return (
    <div className="bg-gradient-to-r from-teal-100 to-cyan-300 dark:from-gray-900 dark:to-gray-800 min-h-screen py-20 px-6 sm:px-12 lg:px-24 flex items-center justify-center">
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 50 }} // Initial position slightly below
            animate={{ opacity: 1, y: 0 }} // Animate to original position
            exit={{ opacity: 0, y: -50 }} // Animate out by moving up
            transition={{ duration: 0.8, ease: "easeInOut" }} // Smoother transition
            className="max-w-3xl w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6 text-center">About Me</h2>
            <div className="prose lg:prose-xl text-gray-700 dark:text-gray-300 leading-relaxed">
              <p>
                {`I'm`} a passionate developer with a keen interest in building web applications and exploring new technologies. I created AbcBlog to share my knowledge, experiences, and projects with the world.
              </p>
              <p>
              {`I'm`} currently focused on full-stack development using technologies like React, Node.js, and various backend solutions. {`I'm`} also interested in exploring the world of AI and its applications in web development.
              </p>
              <p>
                In my free time, I enjoy learning new things, contributing to open-source projects, and staying up-to-date with the latest trends in the tech industry.
              </p>
              <ul className="list-disc pl-6 mt-4">
                <li>
                  <strong>Skills:</strong>{' '}
                  <motion.span
                    initial={{ color: 'gray' }} // Initial color
                    animate={{ color: isHovered ? 'teal' : 'gray' }}
                    transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' }}
                    className="font-bold"
                  >
                    React, Node.js, Express, MongoDB
                  </motion.span>
                  , Tailwind CSS, JavaScript, HTML, CSS
                </li>
                <li>
                  <strong>Interests:</strong> Web Development, AI, Machine Learning, Open Source
                </li>
              </ul>
            </div>
            <div className="flex justify-center mt-8">
              {socialLinks.map((link) => (
                <a
                  key={link.icon}
                  href={link.link}
                  target="_blank"
                  rel="noopener noreferrer" // Important for security when opening new tabs
                  className="mx-4 text-2xl hover:text-teal-500 dark:hover:text-cyan-300 transition duration-300"
                >
                  <i className={link.icon}></i>
                </a>
              ))}
            </div>
            <div className="mt-8 text-center"> {/* Center the button */}
              <a
                href="/resume" // Replace with your resume link
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 dark:bg-cyan-600 dark:hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 dark:focus:ring-cyan-500"
              >
                View Resume
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default About;