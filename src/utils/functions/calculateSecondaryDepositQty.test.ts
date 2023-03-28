import { calculateSecondaryDepositQty } from './calculateSecondaryDepositQty';

const WBTC_DECIMALS = 8;
const USDC_DECIMALS = 6;
const ETH_DECIMALS = 18;

describe('testing calculateSecondaryDepositQty', () => {
    it.each([
        [
            'Balanced 1 ETH-USDC Mint at ±10% Width',
            580953461.6770911, // poolPriceNonDisplay: number, 'scaled' or 'wei' price of the pool
            6, // tokenADecimals: number,
            18, // tokenBDecimals: number,
            '1', // primaryInputValueStr: string, the token quantity entered by the user
            true, // isTokenAPrimary: boolean,
            false, // isTokenABase: boolean,
            false, // isAmbientPosition: boolean,
            1.038616454647909, // depositSkew?: number,
            0.000603, // expected value.
            6, // precision for comparison of default vlaue.
        ],
        [
            'Balanced 100 USDC-ETH Mint at ±10% Width',
            580953461.6770911,
            USDC_DECIMALS,
            ETH_DECIMALS,
            '100',
            true,
            false,
            false,
            1.038616454647909,
            0.060338782468249,
            15,
        ],
        [
            'Balanced 0.00001 USDC-ETH Mint at ±10% Width',
            585685851.9804151,
            USDC_DECIMALS,
            ETH_DECIMALS,
            '0.00001',
            true,
            false,
            false,
            1.0093300287442797,
            5.911503178145104e-9,
            15,
        ],
        [
            'Balanced 1000 USDC-ETH Mint at ±52% Width',
            585685851.9804151,
            USDC_DECIMALS,
            ETH_DECIMALS,
            '1000',
            true,
            false,
            false,
            1.0016912625001917,
            0.5866764004987624,
            15,
        ],
        [
            'Balanced 1000 USDC-ETH Mint at ±12% Width',
            585685851.9804151,
            USDC_DECIMALS,
            ETH_DECIMALS,
            '1000',
            true,
            false,
            false,
            1.007850691212829,
            0.5902838907520361,
            15,
        ],
        [
            'Balanced 1000 USDC-ETH Mint at ±10% Width',
            580949046.2755661,
            ETH_DECIMALS,
            USDC_DECIMALS,
            '1',
            true,
            true,
            false,
            1.0384661373603,
            1657.561372390969,
            15,
        ],
        [
            'Balanced 10 WBTC-ETH Mint at ±10% Width',
            157556275070.23358,
            WBTC_DECIMALS,
            ETH_DECIMALS,
            '10',
            true,
            false,
            false,
            0.976255942594625,
            153.8152498303889,
            15,
        ],
        [
            'Balanced 10 WBTC-ETH Mint at Ambient Width',
            157556275070.23358,
            WBTC_DECIMALS,
            ETH_DECIMALS,
            '10',
            true,
            false,
            true,
            1,
            157.5562750702336,
            15,
        ],
        [
            'Balanced 15.3 WBTC-ETH Mint, non-base token, at ±10% Width',
            157556275070.23358,
            WBTC_DECIMALS,
            ETH_DECIMALS,
            '15.3',
            false,
            false,
            false,
            0.976255942594625,
            0.9946998114212481,
            15,
        ],

        [
            'Balanced 1 ETH-WBTC Mint, non-base token, at ±10% Width',
            157556275070.23358,
            ETH_DECIMALS,
            WBTC_DECIMALS,
            '1',
            true,
            true,
            true,
            1,
            0.06346938575148668,
            15,
        ],
        [
            'Unbalanced 1000 USDC-ETH Mint, at [-46%, +12%] Width',
            576602240.4394826,
            6,
            18,
            '1000',
            true,
            false,
            false,
            0.28913102208717334,
            0.16671359511602166,
            15,
        ],
        [
            'Unbalanced 1000 ETH-USDC Mint, at [-3%, +7%] Width',
            576602240.4394826,
            18,
            6,
            '1000',
            true,
            true,
            false,
            2.2668609959948887,
            765065.7928064138,
            15,
        ],
        [
            'Unbalanced 1000 WBTC-ETH Mint, at [-22%, +5%] Width',
            0.003724870738812943,
            8,
            6,
            '1000',
            true,
            true,
            false,
            0.24864319098007026,
            107972267.73271404,
            15,
        ],
        [
            'Unbalanced 1000 USDC-WBTC Mint, at [-19%, +8%] Width',
            0.003724870738812943,
            6,
            8,
            '1000',
            true,
            false,
            false,
            0.429637409474533,
            0.016003438148510827,
            15,
        ],
        [
            'Unbalanced 1000 USDC-WBTC Mint, at [-38%, -113%] Width (Out of Range)',
            0.003724870738812943,
            6,
            8,
            '1000',
            true,
            false,
            false,
            0,
            0,
            15,
        ],
        [
            'Unbalanced 1000 ETH-WBTC Mint, at [+4%, +5%] Width (Out of Range)',
            157556275070.23358,
            18,
            8,
            '1000',
            true,
            true,
            false,
            Infinity,
            0,
            15,
        ],
        [
            'Unbalanced 2134142 ETH-USDC Mint, at [+2%, +1.83%] Width (Out of Range)',
            576602240.4394826,
            18,
            6,
            '2134142.95',
            false,
            true,
            false,
            0,
            0,
            15,
        ],
    ])(
        'testing case: %s',
        (
            _,
            poolPriceNonDisplay,
            tokenADecimals,
            tokenBDecimals,
            primaryInputValueStr,
            isTokenAPrimary,
            isTokenABase,
            isAmbientPosition,
            depositSkew,
            expected,
            precision,
        ) => {
            const qtyTokenB =
                calculateSecondaryDepositQty(
                    poolPriceNonDisplay,
                    tokenADecimals,
                    tokenBDecimals,
                    primaryInputValueStr,
                    isTokenAPrimary,
                    isTokenABase,
                    isAmbientPosition,
                    depositSkew,
                ) ?? 0;
            expect(qtyTokenB).toBeDefined();
            expect(qtyTokenB).toBeCloseTo(expected, precision);
        },
    );
});
