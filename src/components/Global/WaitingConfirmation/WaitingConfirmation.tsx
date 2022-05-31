import styles from './WaitingConfirmation.module.css';

interface WaitingConfirmationProps {
    content: React.ReactNode;
}

export default function WaitingConfirmation(props: WaitingConfirmationProps) {
    const { content } = props;

    return (
        <div className={styles.wallet_confirm}>
            <div className={styles.loading_animation}>
                {/* <Animation animData={loading2} /> */}
            </div>
            <span className={styles.waiting_detail}>
                <h2>Waiting For Confirmation</h2>
            </span>
            <span className={styles.waiting_detail}>
                <h4>{content}</h4>
            </span>
            <span className={styles.waiting_detail}>
                <p>Please confirm this transaction in your wallet</p>
            </span>
        </div>
    );
}
