"use client";
import styles from './loadingSpinner.module.css'

export const LoadingSpinner = ({size = "5%"}) => {
    return (
        <div className='flex justify-center items-center h-screen'>
            <div className='aspect-square' style={{width:size}}>
                <span className={styles.loader}></span>
            </div>
        </div>);
}
