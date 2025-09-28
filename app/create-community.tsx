// @ts-nocheck
import { router, Stack, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useStore } from '../state/store';

export default function CreateCommunityScreen() {
    const { api, refresh, user } = useStore();
    const [name, setName] = useState('');

    // Get the parentId from the navigation parameters, if it exists
    const { parentId } = useLocalSearchParams();

    const create = async () => {
    if (!name.trim()) return;
    // Make sure you are passing userId here
    await api.createCommunity({ name: name.trim(), parentId: parentId || null, userId: user.id });
    refresh();
    router.back();
};

    return (
        <View style={styles.container}>
            {/* Change the title based on whether we're creating a parent or sub-community */}
            <Stack.Screen options={{ title: parentId ? 'Create Sub-community' : 'Create Community' }} />
            <Text style={styles.label}>Community Name</Text>
            <TextInput style={styles.input} placeholder="e.g., Artificial Intelligence" value={name} onChangeText={setName} />
            
            {/* If a parentId was passed, show a message instead of an input field */}
            {parentId && (
                <Text style={styles.subLabel}>Creating as a sub-community of ID: {parentId}</Text>
            )}

            <TouchableOpacity style={styles.btnPrimary} onPress={create}>
                <Text style={styles.btnText}>Create Community</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F4FAFC', padding: 16 },
    label: { fontWeight: '700', color: '#08313B', marginBottom: 8, fontSize: 16 },
    subLabel: { color: '#4B6A75', marginBottom: 16, fontStyle: 'italic' },
    input: { borderWidth: 1, borderColor: '#CCE1E8', borderRadius: 10, padding: 12, marginBottom: 16, backgroundColor: '#fff', fontSize: 16 },
    btnPrimary: { backgroundColor: '#08313B', padding: 14, borderRadius: 10, alignItems: 'center' },
    btnText: { color: '#FFFFFF', fontWeight: '800', fontSize: 16 },
});