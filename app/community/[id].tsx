// @ts-nocheck
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, useWindowDimensions, TextInput, Alert } from 'react-native';
import { useLocalSearchParams, Stack, Link } from 'expo-router';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import CommunityCard from '../../components/CommunityCard';
import PostCard from '../../components/PostCard';
import { useStore } from '../../state/store';
import { FontAwesome } from '@expo/vector-icons';

// --- THIS COMPONENT IS NOW FIXED ---
const PostsRoute = ({ community }) => {
    const { api, user, refresh } = useStore();
    const [postText, setPostText] = useState('');

    // This function creates a new POST
    const handleCreatePost = async () => {
        if (!postText.trim()) return;
        await api.createPost({ communityId: community.id, userId: user.id, text: postText });
        setPostText(''); // Clear the input
        refresh();
    };

    return (
        <FlatList
            data={community.posts}
            renderItem={({ item }) => <PostCard post={item} />}
            keyExtractor={item => item.id}
            contentContainerStyle={{ padding: 16 }}
            ListEmptyComponent={<Text style={styles.emptyText}>No posts yet. Be the first!</Text>}
            // This header is the form for creating a NEW POST
            ListHeaderComponent={
                <View style={styles.createPostContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder={`What's on your mind, ${user.name}?`}
                        value={postText}
                        onChangeText={setPostText}
                        multiline
                    />
                    <TouchableOpacity style={styles.createPostButton} onPress={handleCreatePost}>
                        <Text style={styles.createPostButtonText}>Create Post</Text>
                    </TouchableOpacity>
                </View>
            }
        />
    );
};
    
const SubcommunitiesRoute = ({ community }) => {
    const { communities, user, api, refresh } = useStore();
    const subCommunities = communities.filter(c => c.parentId === community.id);
    
    const join = async (c) => {
        if (c.members.includes(user.id)) return;
        await api.joinCommunity({ userId: user.id, communityId: c.id });
        refresh();
    };

    const renderSubCommunity = ({ item }) => {
        const isMember = item.members.includes(user.id);
        return (
            <View style={{marginBottom: 8}}>
                <CommunityCard item={item} href={`/community/${item.id}`} />
                {!isMember ? (
                    <TouchableOpacity style={styles.joinButton} onPress={() => join(item)}>
                        <Text style={styles.joinButtonText}>Join</Text>
                    </TouchableOpacity>
                ) : (
                    <View style={styles.joinedBadge}><Text style={styles.joinedText}>✓ Joined</Text></View>
                )}
            </View>
        );
    };

    return (
        <FlatList
            data={subCommunities}
            renderItem={renderSubCommunity}
            keyExtractor={item => item.id}
            contentContainerStyle={{ padding: 16 }}
            ListEmptyComponent={<Text style={styles.emptyText}>No sub-communities yet.</Text>}
            ListHeaderComponent={
                <Link href={`/create-community?parentId=${community.id}`} asChild>
                    <TouchableOpacity style={styles.createSubButton}>
                        <FontAwesome name="plus" size={16} color="#fff" />
                        <Text style={styles.createSubButtonText}>Create New Sub-community</Text>
                    </TouchableOpacity>
                </Link>
            }
        />
    );
};

export default function CommunityDetailScreen() {
    const layout = useWindowDimensions();
    const { id } = useLocalSearchParams();
    const { communities, user } = useStore();
    const community = communities.find(c => c.id === id);
    
    // We removed createPost from here because it now lives in PostsRoute
    
    <Stack.Screen options={{ 
        title: community?.name || 'Community',
        headerRight: () => (
            !community?.parentId && (
                <Link href={`/create-community?parentId=${id}`} asChild>
                    <TouchableOpacity style={{marginRight: 15}}>
                        <FontAwesome name="sitemap" size={24} color="white" />
                    </TouchableOpacity>
                </Link>
            )
        )
    }} />

    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([ { key: 'subcommunities', title: 'Sub-communities' }, { key: 'posts', title: 'Posts' } ]);

    if (!community) { return <Text style={styles.emptyText}>Loading...</Text>; }
    if (community.parentId) { return <PostsRoute community={community} />; }

    const renderScene = SceneMap({ subcommunities: () => <SubcommunitiesRoute community={community} />, posts: () => <PostsRoute community={community} /> });

    return (
        <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{ width: layout.width }}
            renderTabBar={props => <TabBar {...props} style={{ backgroundColor: '#08313B' }} />}
        />
    );
}

const styles = StyleSheet.create({
    emptyText: { textAlign: 'center', marginTop: 50, color: '#7aa0ac', fontSize: 16 },
    joinButton: { backgroundColor: '#00D1B2', padding: 10, borderRadius: 8, alignItems: 'center', marginTop: -4 },
    joinButtonText: { color: '#042a2a', fontWeight: '700' },
    joinedBadge: { backgroundColor: '#eef6f8', padding: 10, borderRadius: 8, alignItems: 'center', marginTop: -4 },
    joinedText: { color: '#4B6A75', fontWeight: '700' },
    createSubButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#007AFF', padding: 12, borderRadius: 10, marginBottom: 16, gap: 8 },
    createSubButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    createPostContainer: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 16, borderWidth: 1, borderColor: '#E2EDF1' },
    input: { borderWidth: 1, borderColor: '#CCE1E8', borderRadius: 10, padding: 12, minHeight: 60, fontSize: 16, textAlignVertical: 'top' },
    createPostButton: { backgroundColor: '#08313B', padding: 12, borderRadius: 10, alignItems: 'center', marginTop: 12 },
    createPostButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});