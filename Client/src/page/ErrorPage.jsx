import { useRouteError } from 'react-router-dom';

const ErrorPage = () => {
    const error = useRouteError();
    console.error(error);

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold text-red-600 dark:text-red-500 mb-4">Oops!</h1>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-2">Sorry, an unexpected error has occurred.</p>
            {error.statusText && <p className="text-lg text-gray-700 dark:text-gray-300 mb-2">Status: {error.statusText}</p>}
            {error.message && <p className="text-lg text-gray-700 dark:text-gray-300 mb-2">Message: {error.message}</p>}
        </div>
    );
};

export default ErrorPage;