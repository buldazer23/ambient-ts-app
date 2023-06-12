import styles from './TransactionDetailsHeader.module.css';
import { Dispatch, SetStateAction, useContext } from 'react';
import ambientLogo from '../../../../assets/images/logos/ambient_logo.svg';
import { FiCopy } from 'react-icons/fi';
import { CgClose } from 'react-icons/cg';
import IconWithTooltip from '../../IconWithTooltip/IconWithTooltip';
import { AppStateContext } from '../../../../contexts/AppStateContext';
interface TransactionDetailsHeaderPropsIF {
    copyTransactionDetailsToClipboard: () => Promise<void>;
    showSettings: boolean;
    setShowSettings: Dispatch<SetStateAction<boolean>>;
    showShareComponent: boolean;
    setShowShareComponent: Dispatch<SetStateAction<boolean>>;
    handleCopyAddress(): void;
}
export default function TransactionDetailsHeader(
    props: TransactionDetailsHeaderPropsIF,
) {
    const {
        handleCopyAddress,
        copyTransactionDetailsToClipboard,
        showShareComponent,
        setShowShareComponent,
    } = props;

    const {
        globalModal: { close: onClose },
    } = useContext(AppStateContext);

    const phIcon = (
        <FiCopy size={25} color='var(--text3)' style={{ opacity: '0' }} />
    );

    const copyTxHashIconWithTooltip = (
        <IconWithTooltip
            title='Copy transaction hash to clipboard'
            placement='bottom'
        >
            <div onClick={handleCopyAddress}>
                <FiCopy size={25} color='var(--text3)' />
            </div>
        </IconWithTooltip>
    );

    const copyImageIconWithTooltip = (
        <IconWithTooltip title='Copy shareable image' placement='bottom'>
            <div onClick={copyTransactionDetailsToClipboard}>
                <FiCopy size={25} color='var(--text3)' />
            </div>
        </IconWithTooltip>
    );

    return (
        <div className={styles.container}>
            <section className={styles.logo_container}>
                <img src={ambientLogo} alt='ambient' width='35px' />
                <span className={styles.ambient_title}>ambient</span>
            </section>

            <section className={styles.settings_control}>
                <button
                    className={styles.info_button}
                    onClick={() => setShowShareComponent(!showShareComponent)}
                >
                    {showShareComponent ? 'Details' : 'Share'}
                </button>

                {showShareComponent ? copyTxHashIconWithTooltip : phIcon}
                {showShareComponent ? copyImageIconWithTooltip : phIcon}

                <div onClick={onClose}>
                    <CgClose size={28} color='var(--text3)' />
                </div>
            </section>
        </div>
    );
}
