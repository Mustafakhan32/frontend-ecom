import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

const Spinner = ({ path = 'login' }) => {
    const [count, setCount] = useState(2)
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        const interval = setInterval(() => {
            setCount((prevValue) => --prevValue)
        }, 1500);
        if (count === 0) {
            navigate(`${path}`, {
                state: location.pathname,
            });
        }
        return () => {
            clearInterval(interval)
        }
    }, [count, navigate, location])

    return (
        <>
            <Header />
            <div className='flex flex-col items-center justify-center min-h-screen space-y-4'>
                <h1 className='text-center text-lg font-semibold'>Redirecting in {count} second{count !== 1 && 's'}</h1>
                <div className='w-12 h-12 border-4 border-black border-dotted rounded-full animate-spin'></div>
                <span className='font-semibold'>Loading...</span>
            </div>
            <Footer />
        </>
    )
}

export default Spinner
