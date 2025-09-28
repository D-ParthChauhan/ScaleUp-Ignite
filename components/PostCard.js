// @ts-nocheck
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useStore } from '../state/store';

export default function PostCard({ post }) {
    const { api, user, refresh } = useStore();
    const [commentText, setCommentText] = useState('');

    const vote = async (delta) => {
        await api.votePost({ userId: user.id, postId: post.id, delta });
        refresh();
    };

    const addComment = async () => {
        if (!commentText.trim()) return;
        await api.addComment({ postId: post.id, userId: user.id, text: commentText });
        setCommentText(''); // Clear the input
        refresh();
    };

    return (
        <View style={styles.postCard}>
            <Text style={styles.postText}>{post.text}</Text>

            {/* Display existing comments */}
            {post.comments?.map(comment => (
                <Text key={comment.id} style={styles.commentText}> ↳ {comment.text}</Text>
            ))}

            {/* New Comment Input */}
            <View style={styles.commentInputContainer}>
                <TextInput
                    style={styles.commentInput}
                    placeholder="Add a comment..."
                    value={commentText}
                    onChangeText={setCommentText}
                />
                <TouchableOpacity style={styles.commentButton} onPress={addComment}>
                    <Text style={styles.commentButtonText}>post</Text>
                </TouchableOpacity>
            </View>

            {/* Vote Buttons */}
            <View style={styles.voteContainer}>
                <TouchableOpacity style={styles.voteButton} onPress={() => vote(1)}><Text>👍 {post.up}</Text></TouchableOpacity>
                <TouchableOpacity style={styles.voteButton} onPress={() => vote(-1)}><Text>👎 {post.down}</Text></TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    postCard: { backgroundColor: '#fff', padding: 16, marginVertical: 8, borderRadius: 12, borderWidth: 1, borderColor: '#E2EDF1' },
    postText: { fontSize: 16, color: '#333', marginBottom: 12 },
    commentText: { fontStyle: 'italic', color: '#555', marginLeft: 16, marginBottom: 8, fontSize: 14 },
    commentInputContainer: { flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#f0f0f0', paddingTop: 12, marginTop: 8 },
    commentInput: { flex: 1, borderWidth: 1, borderColor: '#CCE1E8', borderRadius: 20, paddingVertical: 8, paddingHorizontal: 12, marginRight: 8 },
    commentButton: { backgroundColor: '#08313B', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 20 },
    commentButtonText: { color: 'white', fontWeight: 'bold' },
    voteContainer: { flexDirection: 'row', gap: 16, justifyContent: 'flex-end', marginTop: 12 },
    voteButton: { backgroundColor: '#eef6f8', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20 },
});