// START: Import React and Dongles
import {
    useState,
    useRef,
    useContext,
    ChangeEvent,
    KeyboardEvent,
    memo,
} from 'react';
import { BiSearch } from 'react-icons/bi';

// START: Import JSX Elements
import SidebarAccordion from './SidebarAccordion';
import TopPools from '../../../components/Global/Sidebar/TopPools';
import FavoritePools from '../../../components/Global/Sidebar/FavoritePools';
import SidebarRangePositions from '../../../components/Global/Sidebar/SidebarRangePositions/SidebarRangePositions';
import SidebarLimitOrders from '../../../components/Global/Sidebar/SidebarLimitOrders/SidebarLimitOrders';
import SidebarRecentTransactions from '../../../components/Global/Sidebar/SidebarRecentTransactions/SidebarRecentTransactions';

// START: Import Local Files
import SidebarSearchResults from './SidebarSearchResults/SidebarSearchResults';
import { MdClose } from 'react-icons/md';

import closeSidebarImage from '../../../assets/images/sidebarImages/closeSidebar.svg';
import { AiFillLock, AiFillUnlock } from 'react-icons/ai';
import { BsChevronExpand, BsChevronContract } from 'react-icons/bs';
import RecentPools from '../../../components/Global/Sidebar/RecentPools';
import {
    useSidebarSearch,
    sidebarSearchIF,
} from '../../hooks/useSidebarSearch';
import { SidebarContext } from '../../../contexts/SidebarContext';
import { CrocEnvContext } from '../../../contexts/CrocEnvContext';
import { TokenContext } from '../../../contexts/TokenContext';
import { CachedDataContext } from '../../../contexts/CachedDataContext';
import { DefaultTooltip } from '../../../components/Global/StyledTooltip/StyledTooltip';
import { FlexContainer } from '../../../styled/Common';
import {
    ContentContainer,
    FavoritePoolsIcon,
    LimitsIcon,
    RangesIcon,
    RecentPoolsIcon,
    SearchContainer,
    SearchIcon,
    SearchInput,
    SidebarDiv,
    TopPoolsIcon,
    TransactionsIcon,
} from '../../../styled/Components/Sidebar';
import { GraphDataContext } from '../../../contexts/GraphDataContext';
import useMediaQuery from '../../../utils/hooks/useMediaQuery';

function Sidebar() {
    const { cachedPoolStatsFetch, cachedFetchTokenPrice } =
        useContext(CachedDataContext);
    const { chainData: chainData } = useContext(CrocEnvContext);
    const { tokens } = useContext(TokenContext);
    const { sidebar, toggleMobileModeVisibility, hideOnMobile } =
        useContext(SidebarContext);

    const { positionsByUser, limitOrdersByUser, changesByUser } =
        useContext(GraphDataContext);

    // TODO: can pull into GraphDataContext
    const filterFn = <T extends { chainId: string }>(x: T) =>
        x.chainId === chainData.chainId;

    const _positionsByUser = positionsByUser.positions.filter(filterFn);
    const _txsByUser = changesByUser.changes.filter(filterFn);
    const _limitsByUser = limitOrdersByUser.limitOrders.filter(filterFn);

    const mostRecentTxs = _txsByUser.slice(0, 4);
    const mostRecentPositions = _positionsByUser
        .filter((p) => p.positionLiq > 0)
        .slice(0, 4);
    const mostRecentLimitOrders = _limitsByUser.slice(0, 4);

    const recentPoolsData = [
        {
            name: 'Recent Pools',
            icon: <RecentPoolsIcon open={sidebar.isOpen} size={20} />,

            data: (
                <RecentPools
                    cachedPoolStatsFetch={cachedPoolStatsFetch}
                    cachedFetchTokenPrice={cachedFetchTokenPrice}
                />
            ),
        },
    ];
    const topPoolsSection = [
        {
            name: 'Top Pools',
            icon: <TopPoolsIcon open={sidebar.isOpen} size={20} />,
            data: (
                <TopPools
                    cachedPoolStatsFetch={cachedPoolStatsFetch}
                    cachedFetchTokenPrice={cachedFetchTokenPrice}
                />
            ),
        },
    ];

    const rangePositions = [
        {
            name: 'Liquidity Positions',
            icon: <RangesIcon open={sidebar.isOpen} size={20} />,
            data: <SidebarRangePositions userPositions={mostRecentPositions} />,
        },
    ];

    const recentLimitOrders = [
        {
            name: 'Limit Orders',
            icon: <LimitsIcon open={sidebar.isOpen} size={20} />,
            data: (
                <SidebarLimitOrders limitOrderByUser={mostRecentLimitOrders} />
            ),
        },
    ];

    const favoritePools = [
        {
            name: 'Favorite Pools',
            icon: <FavoritePoolsIcon open={sidebar.isOpen} size={20} />,

            data: (
                <FavoritePools
                    cachedPoolStatsFetch={cachedPoolStatsFetch}
                    cachedFetchTokenPrice={cachedFetchTokenPrice}
                />
            ),
        },
    ];

    const recentTransactions = [
        {
            name: 'Transactions',
            icon: <TransactionsIcon open={sidebar.isOpen} size={20} />,
            data: (
                <SidebarRecentTransactions
                    mostRecentTransactions={mostRecentTxs}
                />
            ),
        },
    ];

    const searchData: sidebarSearchIF = useSidebarSearch(
        _positionsByUser,
        _txsByUser,
        _limitsByUser,
        tokens,
    );

    const [searchInput, setSearchInput] = useState<string>('');
    const [searchMode, setSearchMode] = useState(false);
    false && searchMode;

    // ------------------------------------------
    // ---------------------------Explore SEARCH CONTAINER-----------------------

    const focusInput = () => {
        const inputField = document.getElementById(
            'sidebar_search_input',
        ) as HTMLInputElement;

        inputField.focus();
    };

    const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchMode(true);
        searchData.setInput(e.target.value);
        setSearchInput(e.target.value);
    };

    // id for search input HTML elem in the DOM
    // defined in a const because we reference this multiple places
    const searchInputElementId = 'sidebar_search_input';
    const smallScreen = useMediaQuery('(max-width: 500px)');

    const searchContainer = (
        <SearchContainer
            flexDirection='row'
            alignItems='center'
            justifyContent='center'
            gap={4}
            padding='2px 8px'
        >
            <FlexContainer
                alignItems='center'
                justifyContent='center'
                padding='2px 0 0 0'
            >
                <BiSearch
                    size={18}
                    color={sidebar.isOpen ? 'var(--text2)' : 'var(--accent5)'}
                    onClick={focusInput}
                />
            </FlexContainer>
            <SearchInput
                type='text'
                id={searchInputElementId}
                value={searchData.rawInput}
                placeholder='Search...'
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleSearchInput(e)
                }
                onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                    if (e.code === 'Escape') {
                        // prevent keypress from de-focusing the input
                        e.stopPropagation();
                        // clear search input, DOM will update
                        searchData.clearInput();
                        setSearchInput('');
                    }
                }}
                spellCheck='false'
                autoComplete='off'
                tabIndex={1}
            />
            {searchInput && (
                <FlexContainer
                    onClick={() => {
                        // clear search input, DOM will update
                        searchData.clearInput();
                        setSearchInput('');
                        // manually focus DOM on the search input
                        const searchInput =
                            document.getElementById(searchInputElementId);
                        searchInput && searchInput.focus();
                    }}
                    role='button'
                    tabIndex={0}
                >
                    <MdClose size={18} color='#ebebeb66' />{' '}
                </FlexContainer>
            )}
        </SearchContainer>
    );

    const [openAllDefault, setOpenAllDefault] = useState(false);
    const [isDefaultOverridden, setIsDefaultOverridden] = useState(false);

    const getInitialSidebarLockedStatus = () =>
        sidebar.getStoredStatus() === 'open';
    const [isLocked, setIsLocked] = useState(getInitialSidebarLockedStatus());

    const toggleLockSidebar = () => {
        sidebar.open(!isLocked);
        isLocked && sidebar.resetStoredStatus();
        setIsLocked(!isLocked);
    };

    const toggleExpandCollapseAll = () => {
        setIsDefaultOverridden(true);
        setOpenAllDefault(!openAllDefault);
    };

    // TODO: why are we using an `<input>` as a clickable to close the sidebar?

    const searchContainerDisplay = (
        <FlexContainer
            flexDirection='row'
            alignItems='center'
            justifyContent='center'
            gap={4}
        >
            {sidebar.isOpen ? (
                <>
                    {searchContainer}
                    <FlexContainer
                        flexDirection='row'
                        alignItems='center'
                        justifyContent='center'
                    >
                        <DefaultTooltip
                            title={isLocked ? 'Unlock Sidebar' : 'Lock Sidebar'}
                        >
                            {isLocked ? (
                                <AiFillLock
                                    id='sidebar_is_locked_clickable'
                                    size={18}
                                    onClick={toggleLockSidebar}
                                />
                            ) : (
                                <AiFillUnlock
                                    id='sidebar_is_unlocked_clickable'
                                    size={18}
                                    onClick={toggleLockSidebar}
                                />
                            )}
                        </DefaultTooltip>
                        <DefaultTooltip
                            title={
                                openAllDefault ? 'Collapse All' : 'Expand All'
                            }
                        >
                            {openAllDefault ? (
                                <BsChevronContract
                                    id='sidebar_expand_all_button'
                                    size={18}
                                    onClick={toggleExpandCollapseAll}
                                />
                            ) : (
                                <BsChevronExpand
                                    id='sidebar_collapse_all_button'
                                    size={18}
                                    onClick={toggleExpandCollapseAll}
                                />
                            )}
                        </DefaultTooltip>
                        <DefaultTooltip
                            title={
                                isLocked
                                    ? 'Sidebar locked'
                                    : sidebar.isOpen
                                    ? 'Close Sidebar'
                                    : 'Open Sidebar'
                            }
                        >
                            <input
                                id='close_sidebar_button'
                                type='image'
                                src={closeSidebarImage}
                                alt='close sidebar'
                                onClick={() => {
                                    sidebar.close(true);
                                    if (smallScreen) {
                                        toggleMobileModeVisibility();
                                    }
                                }}
                                disabled={isLocked}
                                style={{ opacity: isLocked ? 0.5 : 1 }}
                            />
                        </DefaultTooltip>
                    </FlexContainer>
                </>
            ) : (
                <div style={{ borderBottom: '1px solid var(--dark3)' }}>
                    <SearchIcon
                        open={sidebar.isOpen}
                        size={20}
                        onClick={() => sidebar.open(false)}
                    />
                </div>
            )}
        </FlexContainer>
    );
    const sidebarRef = useRef<HTMLDivElement>(null);

    const regularSidebarDisplay = (
        <ContentContainer flexDirection='column'>
            {topPoolsSection.map((item, idx) => (
                <SidebarAccordion
                    sidebar={sidebar}
                    shouldDisplayContentWhenUserNotLoggedIn={true}
                    idx={idx}
                    item={item}
                    key={idx}
                    openAllDefault={openAllDefault}
                    isDefaultOverridden={isDefaultOverridden}
                />
            ))}
            {favoritePools.map((item, idx) => (
                <SidebarAccordion
                    sidebar={sidebar}
                    shouldDisplayContentWhenUserNotLoggedIn={true}
                    idx={idx}
                    item={item}
                    key={idx}
                    openAllDefault={openAllDefault}
                    isDefaultOverridden={isDefaultOverridden}
                />
            ))}
            {recentPoolsData.map((item, idx) => (
                <SidebarAccordion
                    sidebar={sidebar}
                    shouldDisplayContentWhenUserNotLoggedIn={true}
                    idx={idx}
                    item={item}
                    key={idx}
                    openAllDefault={openAllDefault}
                    isDefaultOverridden={isDefaultOverridden}
                />
            ))}
            <div style={{ margin: 'auto' }} />
            {recentTransactions.map((item, idx) => (
                <SidebarAccordion
                    sidebar={sidebar}
                    shouldDisplayContentWhenUserNotLoggedIn={false}
                    idx={idx}
                    item={item}
                    key={idx}
                    openAllDefault={openAllDefault}
                    isDefaultOverridden={isDefaultOverridden}
                />
            ))}{' '}
            {recentLimitOrders.map((item, idx) => (
                <SidebarAccordion
                    sidebar={sidebar}
                    shouldDisplayContentWhenUserNotLoggedIn={false}
                    idx={idx}
                    item={item}
                    key={idx}
                    openAllDefault={openAllDefault}
                    isDefaultOverridden={isDefaultOverridden}
                />
            ))}{' '}
            {rangePositions.map((item, idx) => (
                <SidebarAccordion
                    sidebar={sidebar}
                    shouldDisplayContentWhenUserNotLoggedIn={false}
                    idx={idx}
                    item={item}
                    key={idx}
                    openAllDefault={openAllDefault}
                    isDefaultOverridden={isDefaultOverridden}
                />
            ))}
        </ContentContainer>
    );

    if (hideOnMobile) return null;

    return (
        <FlexContainer
            ref={sidebarRef}
            flexDirection='column'
            alignItems='center'
            justifyContent='center'
        >
            <SidebarDiv
                open={sidebar.isOpen}
                onClick={() => {
                    sidebar.isOpen || sidebar.open(false);
                }}
            >
                <FlexContainer
                    flexDirection='column'
                    alignItems='center'
                    fullHeight
                >
                    {searchContainerDisplay}
                    {searchData.isInputValid && sidebar.isOpen && searchMode ? (
                        <SidebarSearchResults
                            searchData={searchData}
                            cachedPoolStatsFetch={cachedPoolStatsFetch}
                            cachedFetchTokenPrice={cachedFetchTokenPrice}
                        />
                    ) : (
                        regularSidebarDisplay
                    )}
                </FlexContainer>
            </SidebarDiv>
        </FlexContainer>
    );
}

export default memo(Sidebar);
