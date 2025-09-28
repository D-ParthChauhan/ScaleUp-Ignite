// @ts-nocheck
import React, { useMemo } from 'react';
import { Text, StyleSheet, ScrollView, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useStore } from '../../state/store';
import CommunityCard from '../../components/CommunityCard';
import { Link, Stack } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

export default function CommunitiesScreen() {
  const { communities, user, loading } = useStore();

  // FIX: All hooks are called at the top, before any conditions.
  const joinedParentCommunities = useMemo(() => {
    if (!user) return []; // Guard against user being null on first render
    return communities.filter(c => c.members.includes(user.id) && !c.parentId);
  }, [communities, user]);

  // The conditional return for loading happens AFTER all hooks.
  if (loading || !user) {
    return <ActivityIndicator size="large" style={styles.container} />;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Stack.Screen
        options={{
          headerRight: () => (
            <Link href="/create-community" asChild>
              <TouchableOpacity style={{ marginRight: 15 }}>
                <FontAwesome name="plus-square-o" size={24} color="white" />
              </TouchableOpacity>
            </Link>
          ),
        }}
      />
      <View style={styles.header}>
        <Text style={styles.h1}>Your Communities</Text>
        <Text style={styles.sub}>A dashboard of your joined parent communities.</Text>
      </View>
      {joinedParentCommunities.length === 0 ? (
        <Text style={styles.emptyText}>You haven't joined any communities yet.</Text>
      ) : (
        joinedParentCommunities.map(item => (
          <CommunityCard key={item.id} item={item} href={`/community/${item.id}`} />
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F4FAFC' },
    contentContainer: { padding: 16 },
    header: { marginBottom: 16 },
    h1: { fontSize: 28, fontWeight: '800', color: '#08313B' },
    sub: { fontSize: 16, color: '#4B6A75', marginTop: 4 },
    emptyText: { textAlign: 'center', marginTop: 50, color: '#7aa0ac', fontSize: 16 },
});