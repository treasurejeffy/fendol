import React from 'react';
import styles from './dashboard.module.scss'; // Adjust the import as needed
import SideBar from '../shared/sidebar/sidebar';
import Header from '../shared/header/header';

export default function Dashboard() {
    return (
        <section className={styles.body}>
            <div className="sticky-top">
                <Header />
            </div>
            <div className="d-flex gap-2">
                <div className={`${styles.sidebar}`}>
                    <SideBar className={styles.sidebarItem} />
                </div>
                <section className={`${styles.content}`}>
                    <main>
                        <div className={styles.create_form}>
                            <h2>Dashboard</h2>
                            {/* Additional form or content goes here */}
                        </div>
                    </main>
                </section>
            </div>
        </section>
    );
}
