// @ts-nocheck
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router'; // Import Link from expo-router

// The component now accepts an "href" for navigation
export default function CommunityCard({ item, href }){
  return (
    // Wrap the TouchableOpacity in a Link to make the whole card tappable
    <Link href={href} asChild>
      <TouchableOpacity style={styles.card}>
        <View style={{flex:1}}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.meta}>
            {item.parentId ? 'Sub-community' : 'Parent community'} • {item.members.length} members • {item.posts.length} posts
          </Text>
        </View>
      </TouchableOpacity>
    </Link>
  );
}

const styles = StyleSheet.create({
  card:{ backgroundColor:'#fff', borderRadius:14, padding:14, marginBottom:12, borderWidth:1, borderColor:'#E2EDF1', flexDirection: 'row' },
  name:{ fontSize:18, fontWeight:'700', color:'#08313B' },
  meta:{ fontSize:12, color:'#4B6A75', marginTop:4 }
});