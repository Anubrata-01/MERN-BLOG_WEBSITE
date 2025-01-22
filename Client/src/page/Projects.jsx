
const Projects = () => {
  const projects = [
    {
      title: 'Project 1',
      description: 'A brief description of project 1.',
      link: '#',
    },
    {
      title: 'Project 2',
      description: 'A brief description of project 2.',
      link: '#',
    },
    // Add more projects here
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-8 text-center">My Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">{project.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{project.description}</p>
              <a href={project.link} className="text-blue-500 hover:underline">Learn More</a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Projects;