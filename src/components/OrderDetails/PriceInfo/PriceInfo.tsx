import styles from './PriceInfo.module.css';
import Row from '../../Global/Row/Row';
import { useAppDispatch } from '../../../utils/hooks/reduxToolkit';
import { toggleDidUserFlipDenom } from '../../../utils/state/tradeDataSlice';
import Divider from '../../Global/Divider/Divider';
import { motion } from 'framer-motion';
import { useProcessOrder } from '../../../utils/hooks/useProcessOrder';
import { LimitOrderIF } from '../../../utils/interfaces/exports';
import NoTokenIcon from '../../Global/NoTokenIcon/NoTokenIcon';

type ItemIF = {
    slug: string;
    name: string;
    checked: boolean;
};
interface IPriceInfoProps {
    // usdValue: number | undefined;
    limitOrder: LimitOrderIF;
    // lowRangeDisplay: string;
    // highRangeDisplay: string;
    // baseCollateralDisplay: string | undefined;
    // quoteCollateralDisplay: string | undefined;
    // baseFeesDisplay: string | undefined;
    // quoteFeesDisplay: string | undefined;
    // baseTokenLogoURI: string;
    // quoteTokenLogoURI: string;
    // baseTokenSymbol: string;
    // quoteTokenSymbol: string;

    // isDenomBase: boolean;

    controlItems: ItemIF[];
}

export default function PriceInfo(props: IPriceInfoProps) {
    const { limitOrder, controlItems } = props;
    const dispatch = useAppDispatch();
    const {
        usdValue,
        baseTokenSymbol,
        quoteTokenSymbol,
        isDenomBase,
        baseTokenLogo,
        quoteTokenLogo,
        startPriceDisplay,
        finishPriceDisplay,
        // bidTick,
        // askTick,
        // positionLiqTotalUSD,

        baseDisplayFrontend,
        quoteDisplayFrontend,
        // positionLiquidity,
    } = useProcessOrder(limitOrder);
    // const data = useProcessOrder(limitOrder);
    // console.log(data);

    const liquidityContent = (
        <motion.div
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.info_container}
        >
            <p>{limitOrder.claimableLiq !== '0' ? 'Claimable Liquidity' : 'Removable Liquidity'}</p>
            <Row>
                <div className={styles.align_center}>
                    <img src={baseTokenLogo} alt='' width='20px' />
                    {baseTokenSymbol}
                </div>

                <div className={styles.info_text}>{baseDisplayFrontend}</div>
            </Row>
            <Row>
                <div className={styles.align_center}>
                    <img src={quoteTokenLogo} alt='' width='20px' />
                    {quoteTokenSymbol}
                </div>
                <div className={styles.info_text}>{quoteDisplayFrontend}</div>
            </Row>
            {/*  */}
            {/* <Divider /> */}
            {/* <div className={styles.divider}></div> */}
            {/* <Row>
                <span> Total Liquidity</span>
                <div className={styles.info_text}>
                    {positionLiqTotalUSD ? positionLiqTotalUSD.toFixed(2) : '...'}
                </div>
            </Row>
            <Row>
                <span> Liquidity Wei </span>
                <div className={styles.info_text}>
                    {positionLiquidity ? parseFloat(positionLiquidity).toFixed(2) : '...'}
                </div>
            </Row> */}
            {/*  */}
        </motion.div>
    );

    // const tickContent = (
    //     <motion.div
    //         layout
    //         initial={{ opacity: 0 }}
    //         animate={{ opacity: 1 }}
    //         exit={{ opacity: 0 }}
    //         className={styles.info_container}
    //     >
    //         <Row>
    //             <span>Bid Tick</span>
    //             <div className={styles.info_text}>{bidTick}</div>
    //         </Row>

    //         <Row>
    //             <span>Ask Tick</span>
    //             <div className={styles.info_text}>{askTick}</div>
    //         </Row>
    //     </motion.div>
    // );

    const totalValueContent = (
        <motion.div
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.info_container}
        >
            <Row>
                <span>Current Value</span>
                <div className={styles.info_text}>${usdValue}</div>
            </Row>
        </motion.div>
    );

    const tokenPairDetails = (
        <div
            className={styles.token_pair_details_container}
            onClick={() => {
                dispatch(toggleDidUserFlipDenom());
            }}
        >
            <div className={styles.token_pair_images}>
                <div>
                    {isDenomBase && baseTokenLogo ? (
                        <img src={baseTokenLogo} alt={baseTokenSymbol} />
                    ) : isDenomBase && !baseTokenLogo ? (
                        <NoTokenIcon tokenInitial={baseTokenSymbol.charAt(0)} width='30px' />
                    ) : !isDenomBase && quoteTokenLogo ? (
                        <img src={quoteTokenLogo} alt={quoteTokenSymbol} />
                    ) : (
                        <NoTokenIcon tokenInitial={quoteTokenSymbol.charAt(0)} width='30px' />
                    )}
                </div>
                <div>
                    {isDenomBase && quoteTokenLogo ? (
                        <img src={quoteTokenLogo} alt={quoteTokenSymbol} />
                    ) : isDenomBase && !quoteTokenLogo ? (
                        <NoTokenIcon tokenInitial={quoteTokenSymbol.charAt(0)} width='30px' />
                    ) : !isDenomBase && baseTokenLogo ? (
                        <img src={baseTokenLogo} alt={baseTokenSymbol} />
                    ) : (
                        <NoTokenIcon tokenInitial={baseTokenSymbol.charAt(0)} width='30px' />
                    )}
                </div>
                {/* <img src={isDenomBase ? quoteTokenLogo : baseTokenLogo} alt={quoteTokenSymbol} /> */}
            </div>
            <p>
                {isDenomBase ? baseTokenSymbol : quoteTokenSymbol} /{' '}
                {isDenomBase ? quoteTokenSymbol : baseTokenSymbol}
            </p>
        </div>
    );

    const startFinishPriceDisplay = (
        <div className={styles.min_max_price}>
            <div className={styles.min_max_content}>
                Start Price
                <span className={styles.min_price}>
                    {startPriceDisplay ? startPriceDisplay : '...'}
                    {/* {lowPriceDisplay ? parseFloat(lowPriceDisplay).toFixed(2) : 0} */}
                </span>
            </div>
            <div className={styles.min_max_content}>
                Finish Price
                <span className={styles.max_price}>
                    {finishPriceDisplay ? finishPriceDisplay : '...'}
                    {/* {highPriceDisplay ? parseFloat(highPriceDisplay).toFixed(2) : 'Infinity'} */}
                </span>
            </div>
        </div>
    );
    // console.log(controlItems);

    const isOrderClaimable = limitOrder.claimableLiq !== '0';

    const descriptionContent = (
        <motion.div
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.info_container}
        >
            <span>
                {`This limit order ${
                    isOrderClaimable ? 'completed' : 'will complete'
                }  execution and  ${
                    isOrderClaimable ? 'became' : 'become'
                } claimable when the price of ${isDenomBase ? baseTokenSymbol : quoteTokenSymbol}
                ${
                    isDenomBase
                        ? isOrderClaimable
                            ? 'increased'
                            : 'increases'
                        : isOrderClaimable
                        ? 'decreased'
                        : 'decreases'
                } to  ${finishPriceDisplay} ${isDenomBase ? quoteTokenSymbol : baseTokenSymbol}.`}
            </span>
        </motion.div>
    );

    return (
        <div className={styles.main_container}>
            <div className={styles.price_info_container}>
                {tokenPairDetails}
                <Divider />
                {controlItems[2] && totalValueContent}
                {/* {controlItems[0] && tickContent} */}
                <Divider />
                {controlItems[1] && liquidityContent}
                <Divider />
                {startFinishPriceDisplay}
                <Divider />
                {descriptionContent}
                <Divider />
            </div>
        </div>
    );
}
