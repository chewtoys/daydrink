/** @jsx jsx */
import {jsx} from '@emotion/core';
import {useColorMode, Box, Text, Flex, Spinner} from '@chakra-ui/core';
import {request} from 'graphql-request';
import useSWR from 'swr';

import DealCard from '../components/DealCard';
import SideNav from '../components/SideNav';
import MobileFilters from '../components/MobileFilters';

const API = 'https://daydrink.herokuapp.com/v1/graphql';

export const Container = (props) => <Box width="full" maxWidth="1280px" mx="auto" px={6} {...props} />;

const DealsPage = ({search}) => {
    const {colorMode} = useColorMode();
    const {data} = useSWR(
        `{
            deals(order_by: {score: desc}) {
                score
                id
                description
                alcoholType
                location {
                    id
                    name
                }
              }
        }`,
        (query) => request(API, query)
    );

    const matchesSearch = (deal) => deal.description.toLowerCase().includes(search.toLowerCase());
    const allDeals = data ? data.deals : [];
    const filteredDeals = allDeals.filter(matchesSearch);

    return (
        <Box h="100%">
            <SideNav display={['none', null, 'block']} maxWidth="18rem" width="full" />
            <Box pl={[0, null, '18rem']} mt="4rem">
                <Box as="section" pt={6} pb={6} backgroundColor={colorMode === 'light' ? 'gray.100' : 'gray.900'}>
                    <Container>
                        <MobileFilters />
                        <Text mb={2} fontWeight="bold">
                            {'Active Now'}
                        </Text>

                        {!data ? (
                            <Flex pt={24} align="center" justify="center">
                                <Spinner size="xl" label="Loading Deals" />
                            </Flex>
                        ) : (
                            <>
                                {filteredDeals.map((deal) => (
                                    <DealCard key={deal.id} {...deal} />
                                ))}
                                <Flex justify="flex-end" as="i" color="gray.500">
                                    {`Showing ${filteredDeals.length} out of ${allDeals.length} deals in Des Moines`}
                                </Flex>
                            </>
                        )}
                    </Container>
                </Box>
            </Box>
        </Box>
    );
};

export default DealsPage;
