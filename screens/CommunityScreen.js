// screens/CommunityScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const tabs = ['Popular', 'Recent', 'Nearby'];

const initialPosts = [
  {
    id: '1',
    name: 'Amara K.',
    time: '2h ago',
    location: 'Santorini, Greece',
    text: 'The sunset views from Oia are absolutely breathtaking! Arrive 2 hours early to grab a good spot.',
    likes: 142,
    comments: 28,
  },
  {
    id: '2',
    name: 'Lucas M.',
    time: '5h ago',
    location: 'Kyoto, Japan',
    text: 'Visit Fushimi Inari early morning to avoid the crowd. Try the street food near the entrance.',
    likes: 96,
    comments: 19,
  },
];

function StatChip({ icon, value }) {
  return (
    <View style={styles.statChip}>
      <Ionicons name={icon} size={16} color="#ff7a45" />
      <Text style={styles.statText}>{value}</Text>
    </View>
  );
}

function PostCard({ post }) {
  return (
    <View style={styles.postCard}>
      {/* header */}
      <View style={styles.postHeader}>
        <View style={styles.avatar} />
        <View style={{ flex: 1 }}>
          <Text style={styles.postName}>{post.name}</Text>
          <Text style={styles.postMeta}>
            {post.time} • {post.location}
          </Text>
        </View>
      </View>

      {/* body */}
      <View style={styles.postBody}>
        <Text style={styles.postText}>{post.text}</Text>
      </View>

      {/* actions */}
      <View style={styles.postActions}>
        <StatChip icon="heart-outline" value={post.likes} />
        <StatChip icon="chatbubble-ellipses-outline" value={post.comments} />
        <View style={{ flexDirection: 'row' }}>
          <Ionicons
            name="share-outline"
            size={18}
            color="#888"
            style={{ marginRight: 4 }}
          />
          <Ionicons name="bookmark-outline" size={18} color="#888" />
        </View>
      </View>
    </View>
  );
}

export default function CommunityScreen() {
  const [activeTab, setActiveTab] = useState('Popular');
  const [text, setText] = useState('');
  const [posts, setPosts] = useState(initialPosts);

  const handlePost = () => {
    if (!text.trim()) return;
    const newPost = {
      id: Date.now().toString(),
      name: 'You',
      time: 'Just now',
      location: 'Unknown location',
      text,
      likes: 0,
      comments: 0,
    };
    setPosts([newPost, ...posts]);
    setText('');
  };

  const renderPost = ({ item }) => <PostCard post={item} />;

  return (
    <View style={styles.container}>
      {/* header */}
      <View style={styles.headerArea}>
        <Text style={styles.title}>Community</Text>
        <Text style={styles.subtitle}>Share tips with fellow travelers</Text>

        {/* input */}
        <View style={styles.inputRow}>
          <Ionicons name="create-outline" size={20} color="#888" />
          <TextInput
            placeholder="Share a travel tip..."
            placeholderTextColor="#777"
            style={styles.input}
            value={text}
            onChangeText={setText}
          />
          <TouchableOpacity style={styles.postButton} onPress={handlePost}>
            <Text style={styles.postButtonText}>Post</Text>
          </TouchableOpacity>
        </View>

        {/* tabs */}
        <View style={styles.tabRow}>
          {tabs.map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.tabChip, activeTab === t && styles.tabChipActive]}
              onPress={() => setActiveTab(t)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === t && styles.tabTextActive,
                ]}
              >
                {t}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* feed */}
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={renderPost}
        contentContainerStyle={{ padding: 20, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050b18' },

  headerArea: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: '#131b33',
  },
  title: { color: '#ffffff', fontSize: 24, fontWeight: '700' },
  subtitle: { color: '#b0b4c3', fontSize: 13, marginTop: 4 },

  inputRow: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1f2740',
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  input: { flex: 1, marginHorizontal: 6, color: '#ffffff', fontSize: 14 },
  postButton: {
    backgroundColor: '#ff7a45',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  postButtonText: { color: '#ffffff', fontWeight: '600', fontSize: 13 },

  tabRow: {
    flexDirection: 'row',
    marginTop: 12,
  },
  tabChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    marginRight: 8,
    backgroundColor: '#1f2740',
  },
  tabChipActive: {
    backgroundColor: '#ff7a45',
  },
  tabText: { color: '#d0d3e0', fontSize: 12 },
  tabTextActive: { color: '#ffffff' },

  postCard: {
    backgroundColor: '#161b2b',
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#ffb38a',
    marginRight: 10,
  },
  postName: { color: '#ffffff', fontSize: 14, fontWeight: '600' },
  postMeta: { color: '#b0b4c3', fontSize: 11, marginTop: 2 },

  postBody: { marginTop: 10 },
  postText: { color: '#e1e3f0', fontSize: 13 },

  postActions: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statChip: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    color: '#c3c6d6',
    fontSize: 12,
    marginLeft: 4,
  },
});
