// src/components/Board/SpotifySearch.js
import React, { useEffect, useState } from 'react';
import { Input, Button, VStack, List, ListItem, Text } from '@chakra-ui/react';
import { getSpotifyToken } from '../../utils/spotifyAuth';

const SpotifySearch = ({ onSelectTrack }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [tracks, setTracks] = useState([]);
    const [token, setToken] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    useEffect(() => {
        if (!token) {
            const newToken = getSpotifyToken();
            setToken(newToken);
            console.log("test");
        }
    }, []);
    const searchTracks = async () => {
        console.log(searchTerm);
        if (!token) {
            const newToken = getSpotifyToken();
            setToken(newToken);
            console.log("test");
        }
        try {
            const response = await fetch(`https://api.spotify.com/v1/search?q=김치&type=track`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            console.log(data);
            if (data.tracks) {
                setTracks(data.tracks.items);
                setErrorMessage('');
            } else {
                setTracks([]);
                setErrorMessage('No tracks found.');
            }
        } catch (error) {
            setErrorMessage('Error fetching tracks. Please try again.');
            console.error('Error fetching tracks:', error);
        }
    };
    return (
        <VStack spacing={4} width="full">
            <Input
                textColor="black"
                placeholder="Search for a track"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button onClick={searchTracks} colorScheme="green">
                Search
            </Button>
            {errorMessage && <Text color="red">{errorMessage}</Text>}
            <List spacing={2} width="full">
                {tracks.map((track) => (
                    <ListItem
                        key={track.id}
                        onClick={() => onSelectTrack(track)}
                        cursor="pointer"
                        _hover={{ bg: 'gray.100' }}
                        p={2}
                    >
                        <Text>
                            {track.name} by {track.artists[0].name}
                        </Text>
                    </ListItem>
                ))}
            </List>
        </VStack>
    );
};

export default SpotifySearch;