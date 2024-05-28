import React, { useState } from 'react';
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    Switch,
    Textarea,
    VStack,
    Heading,
    Text,
    HStack,
    IconButton,
} from '@chakra-ui/react';
import { EditIcon } from '@chakra-ui/icons';
import SpotifySearch from './SpotifySearch';
import { useNavigate } from 'react-router-dom';

const CreateBoardPost = () => {
    const command = "write";
    const [contents, setContents] = useState('');
    const [isPublic, setIsPublic] = useState(true);
    const [file, setFile] = useState(null);
    const [responseMessage, setResponseMessage] = useState('');
    const [selectedTrack, setSelectedTrack] = useState(null);
    const [showSpotifySearch, setShowSpotifySearch] = useState(false);

    const navigate = useNavigate();
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json;charset=utf-8');
    
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: JSON.stringify({
                    command: command,
                    contents: contents,
                    isPublic: isPublic,
                    track: selectedTrack ? selectedTrack.id : null
                }),
                credentials: 'include',
            };

            fetch(`${process.env.REACT_APP_SERVER_URL}/board/service`, requestOptions)
                .then((response) => {
                    if (response.ok) {
                        setResponseMessage('Post created successfully!');
                        navigate('/board/search');
                    } else {
                        throw new Error('Failed to create post');
                    }
                })
                .catch((error) => {
                    setResponseMessage('Failed to create post.');
                    console.error('There was an error!', error);
                });
        } catch (error) {
            setResponseMessage('Failed to create post.');
            console.error('There was an error!', error);
        }
    };

    return (
        <Box
            maxW="600px"
            mx="auto"
            p={4}
            borderWidth={1}
            borderRadius="lg"
            boxShadow="lg"
            bg="white"
        >
            <VStack spacing={4} as="form" onSubmit={handleSubmit}>
                <FormControl id="file">
                    <FormLabel>Upload Photo</FormLabel>
                    <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setFile(e.target.files[0])}
                    />
                </FormControl>
                <Heading textColor="black">내용</Heading>
                <FormControl id="contents" isRequired>
                    <Textarea
                        textColor="black"
                        placeholder="Placeholder"
                        value={contents}
                        onChange={(e) => setContents(e.target.value)}
                    />
                </FormControl>
                <HStack width="full" justifyContent="space-between">
                    <Button colorScheme="purple" textColor="black" variant="solid" onClick={() => setShowSpotifySearch(!showSpotifySearch)}>
                        + Music
                    </Button>
                    <IconButton
                        icon={<EditIcon />}
                        colorScheme="purple"
                        variant="outline"
                        aria-label="Edit"
                    />
                </HStack>
                {showSpotifySearch && <SpotifySearch onSelectTrack={setSelectedTrack} />}
                {selectedTrack && (
                    <Text textColor="black">
                        Selected Track: {selectedTrack.name} by {selectedTrack.artists[0].name}
                    </Text>
                )}
                <FormControl display="flex" alignItems="center">
                    <FormLabel htmlFor="isPublic" mb="0" textColor="purple">
                        공개 여부
                    </FormLabel>
                    <Switch
                        id="isPublic"
                        isChecked={isPublic}
                        onChange={() => setIsPublic(!isPublic)}
                    />
                </FormControl>
                <Button type="submit" colorScheme="blue" width="full">
                    Create Post
                </Button>
                {responseMessage && <Text textColor="red" >{responseMessage}</Text>}
            </VStack>
        </Box>
    );
};

export default CreateBoardPost;