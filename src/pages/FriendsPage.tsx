import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { UserPlus, Check, X, Search, Users } from 'lucide-react';
import toast from 'react-hot-toast';

interface Profile {
  id: string;
  username: string;
  full_name: string;
  bio: string;
  avatar_url: string;
}

interface Friendship {
  id: string;
  requester_id: string;
  addressee_id: string;
  status: 'pending' | 'accepted' | 'declined';
  created_at: string;
  requester?: Profile;
  addressee?: Profile;
}

export default function FriendsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'suggestions' | 'requests' | 'friends'>('suggestions');
  const [suggestions, setSuggestions] = useState<Profile[]>([]);
  const [friendRequests, setFriendRequests] = useState<Friendship[]>([]);
  const [friends, setFriends] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchAllData();
  }, [user]);

  const fetchAllData = async () => {
    if (!user) return;

    await Promise.all([
      fetchSuggestions(),
      fetchFriendRequests(),
      fetchFriends(),
    ]);
    setLoading(false);
  };

  const fetchSuggestions = async () => {
    try {
      // Get all users except current user and existing friends/requests
      const { data: existingConnections } = await supabase
        .from('friendships')
        .select('requester_id, addressee_id')
        .or(`requester_id.eq.${user?.id},addressee_id.eq.${user?.id}`);

      const connectedUserIds = new Set([
        user?.id,
        ...(existingConnections || []).flatMap(conn => [conn.requester_id, conn.addressee_id])
      ]);

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .not('id', 'in', `(${Array.from(connectedUserIds).join(',')})`)
        .limit(10);

      if (error) throw error;
      setSuggestions(data || []);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const fetchFriendRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('friendships')
        .select(`
          *,
          requester:profiles!friendships_requester_id_fkey(*)
        `)
        .eq('addressee_id', user?.id)
        .eq('status', 'pending');

      if (error) throw error;
      setFriendRequests(data || []);
    } catch (error) {
      console.error('Error fetching friend requests:', error);
    }
  };

  const fetchFriends = async () => {
    try {
      const { data, error } = await supabase
        .from('friendships')
        .select(`
          *,
          requester:profiles!friendships_requester_id_fkey(*),
          addressee:profiles!friendships_addressee_id_fkey(*)
        `)
        .or(`requester_id.eq.${user?.id},addressee_id.eq.${user?.id}`)
        .eq('status', 'accepted');

      if (error) throw error;

      const friendProfiles = (data || []).map(friendship => {
        return friendship.requester_id === user?.id 
          ? friendship.addressee 
          : friendship.requester;
      }).filter(Boolean) as Profile[];

      setFriends(friendProfiles);
    } catch (error) {
      console.error('Error fetching friends:', error);
    }
  };

  const sendFriendRequest = async (addresseeId: string) => {
    try {
      const { error } = await supabase
        .from('friendships')
        .insert({
          requester_id: user?.id,
          addressee_id: addresseeId,
          status: 'pending',
        });

      if (error) throw error;

      setSuggestions(prev => prev.filter(user => user.id !== addresseeId));
      toast.success('Friend request sent!');
    } catch (error: any) {
      toast.error('Error sending friend request: ' + error.message);
    }
  };

  const respondToFriendRequest = async (requestId: string, status: 'accepted' | 'declined') => {
    try {
      const { error } = await supabase
        .from('friendships')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', requestId);

      if (error) throw error;

      if (status === 'accepted') {
        toast.success('Friend request accepted!');
        fetchFriends();
      } else {
        toast.success('Friend request declined');
      }

      fetchFriendRequests();
    } catch (error: any) {
      toast.error('Error responding to friend request: ' + error.message);
    }
  };

  const filteredSuggestions = suggestions.filter(user =>
    user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFriends = friends.filter(friend =>
    friend.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    friend.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Friends & Connections</h1>
        <p className="text-blue-100">Discover new people and manage your connections</p>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for people..."
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="flex border-b border-gray-200">
          {[
            { id: 'suggestions', label: 'Suggestions', count: suggestions.length },
            { id: 'requests', label: 'Requests', count: friendRequests.length },
            { id: 'friends', label: 'Friends', count: friends.length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 px-6 py-4 text-center font-medium transition-all ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* Friend Suggestions */}
          {activeTab === 'suggestions' && (
            <div className="space-y-4">
              {filteredSuggestions.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No suggestions</h3>
                  <p className="text-gray-600">We'll suggest new people to connect with as more users join!</p>
                </div>
              ) : (
                filteredSuggestions.map((suggestion) => (
                  <div key={suggestion.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-lg">
                          {suggestion.full_name?.charAt(0) || suggestion.username?.charAt(0) || 'U'}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {suggestion.full_name || suggestion.username}
                        </h3>
                        <p className="text-gray-600 text-sm">@{suggestion.username}</p>
                        {suggestion.bio && (
                          <p className="text-gray-500 text-sm mt-1">{suggestion.bio}</p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => sendFriendRequest(suggestion.id)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all flex items-center space-x-2"
                    >
                      <UserPlus className="h-4 w-4" />
                      <span>Add Friend</span>
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Friend Requests */}
          {activeTab === 'requests' && (
            <div className="space-y-4">
              {friendRequests.length === 0 ? (
                <div className="text-center py-12">
                  <UserPlus className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No friend requests</h3>
                  <p className="text-gray-600">When someone sends you a friend request, it will appear here.</p>
                </div>
              ) : (
                friendRequests.map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-lg">
                          {request.requester?.full_name?.charAt(0) || request.requester?.username?.charAt(0) || 'U'}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {request.requester?.full_name || request.requester?.username}
                        </h3>
                        <p className="text-gray-600 text-sm">@{request.requester?.username}</p>
                        <p className="text-gray-500 text-sm">Wants to be your friend</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => respondToFriendRequest(request.id, 'accepted')}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all flex items-center space-x-2"
                      >
                        <Check className="h-4 w-4" />
                        <span>Accept</span>
                      </button>
                      <button
                        onClick={() => respondToFriendRequest(request.id, 'declined')}
                        className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-all flex items-center space-x-2"
                      >
                        <X className="h-4 w-4" />
                        <span>Decline</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Friends List */}
          {activeTab === 'friends' && (
            <div className="space-y-4">
              {filteredFriends.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No friends yet</h3>
                  <p className="text-gray-600">Start connecting with people to build your network!</p>
                </div>
              ) : (
                filteredFriends.map((friend) => (
                  <div key={friend.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-lg">
                          {friend.full_name?.charAt(0) || friend.username?.charAt(0) || 'U'}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {friend.full_name || friend.username}
                        </h3>
                        <p className="text-gray-600 text-sm">@{friend.username}</p>
                        {friend.bio && (
                          <p className="text-gray-500 text-sm mt-1">{friend.bio}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-green-600">
                      <Check className="h-5 w-5" />
                      <span className="font-medium">Friends</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}