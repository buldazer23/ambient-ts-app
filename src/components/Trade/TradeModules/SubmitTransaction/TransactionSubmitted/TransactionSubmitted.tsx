import styles from './TransactionSubmitted.module.css';
import Animation from '../../../../Global/Animation/Animation';
import completed from '../../../../../assets/animations/completed.json';
import addTokenToWallet from './addTokenToWallet';
import Button from '../../../../Form/Button';
import { FiExternalLink } from 'react-icons/fi';
import { useLocation } from 'react-router-dom';
import { getChainExplorer } from '../../../../../ambient-utils/dataLayer';

interface PropsIF {
    type:
        | 'Swap'
        | 'Limit'
        | 'Range'
        | 'Reposition'
        | 'Remove'
        | 'Harvest'
        | 'Reset';
    hash: string;
    tokenBAddress: string;
    tokenBSymbol: string;
    tokenBDecimals: number;
    tokenBImage: string;
    chainId: string | number;
    isConfirmed: boolean;
    noAnimation?: boolean;
}

export default function TransactionSubmitted(props: PropsIF) {
    const {
        type,
        hash,
        tokenBAddress,
        tokenBSymbol,
        tokenBDecimals,
        tokenBImage,
        noAnimation,
        chainId,
        isConfirmed,
    } = props;

    const blockExplorer = getChainExplorer(chainId);
    const txUrlOnBlockExplorer = `${blockExplorer}tx/${hash}`;
    const currentLocation = useLocation()?.pathname;

    const logoURI = tokenBImage;

    const handleAddToMetaMask = async () => {
        await addTokenToWallet(
            tokenBAddress,
            tokenBSymbol,
            tokenBDecimals,
            logoURI,
        );
    };

    const addToMetaMaskButton = (
        <Button
            idForDOM='import_token_B_into_wallet_button'
            flat
            title={`Import ${tokenBSymbol} into Connected Wallet`}
            action={handleAddToMetaMask}
            disabled={false}
        />
    );

    const etherscanButton = (
        <a
            href={txUrlOnBlockExplorer}
            target='_blank'
            rel='noreferrer'
            className={styles.view_etherscan}
            aria-label='view on etherscan'
        >
            View on Etherscan
            <FiExternalLink size={18} color='var(--text1)' />
        </a>
    );
    return (
        <div
            className={`${styles.transaction_submitted} ${
                noAnimation && styles.noAnimation_submitted
            }`}
        >
            <div
                style={{
                    height: noAnimation ? 'auto' : '180px',
                }}
            >
                {!noAnimation && (
                    <div className={styles.completed_animation}>
                        <Animation animData={completed} loop={false} />
                    </div>
                )}
            </div>

            <h2 style={{ marginBottom: '15px' }}>
                {type === 'Limit'
                    ? `Limit Transaction ${
                          isConfirmed ? 'Confirmed' : 'Successfully Submitted'
                      }`
                    : type === 'Range'
                    ? `Pool Transaction ${
                          isConfirmed ? 'Confirmed' : 'Successfully Submitted'
                      }`
                    : type === 'Reposition'
                    ? `Reposition ${
                          isConfirmed ? 'Confirmed' : 'Successfully Submitted'
                      }`
                    : type === 'Harvest'
                    ? `Harvest ${
                          isConfirmed ? 'Confirmed' : 'Successfully Submitted'
                      }`
                    : type === 'Reset'
                    ? `Reset ${
                          isConfirmed ? 'Confirmed' : 'Successfully Submitted'
                      }`
                    : type === 'Remove'
                    ? `Removal ${
                          isConfirmed ? 'Confirmed' : 'Successfully Submitted'
                      }`
                    : `Swap Transaction ${
                          isConfirmed ? 'Confirmed' : 'Successfully Submitted'
                      }`}
            </h2>
            <div
                className={`${styles.action_buttons} ${
                    noAnimation && styles.bypass_buttons
                }`}
            >
                {txUrlOnBlockExplorer && etherscanButton}
                {tokenBSymbol === 'ETH' || currentLocation === '/trade/pool'
                    ? null
                    : addToMetaMaskButton}
            </div>
        </div>
    );
}
