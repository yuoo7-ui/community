import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

const Stack = createNativeStackNavigator();

const App = () => {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]); 
  const [currentUser, setCurrentUser] = useState(null);

  return (
    <Stack.Navigator initialRouteName="게시판">
      <Stack.Screen
        name="게시판"
        options={{
          headerRight: () => (
            <HeaderButtons currentUser={currentUser} setCurrentUser={setCurrentUser} />
          ),
        }}
      >
        {(props) => <BoardScreen {...props} posts={posts} setPosts={setPosts} currentUser={currentUser} />}
      </Stack.Screen>
      <Stack.Screen name="게시글 작성">
        {(props) => <WriteScreen {...props} posts={posts} setPosts={setPosts} currentUser={currentUser} />}
      </Stack.Screen>
      <Stack.Screen name="게시글 상세">
        {(props) => (
          <PostDetailScreen
            {...props}
            post={props.route.params.post}
            posts={posts}
            setPosts={setPosts}
            currentUser={currentUser} 
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="로그인">
        {(props) => <LoginScreen {...props} users={users} setUsers={setUsers} setCurrentUser={setCurrentUser} />}
      </Stack.Screen>
      <Stack.Screen name="회원가입">
        {(props) => <SignUpScreen {...props} setUsers={setUsers} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

// Header 버튼 (로그인, 회원가입, 로그아웃)
const HeaderButtons = ({ currentUser, setCurrentUser }) => {
  const navigation = useNavigation();

  const handleLogout = () => {
    setCurrentUser(null);
    navigation.navigate('게시판');
  };

  return (
    <View style={styles.headerButtons}>
      {currentUser ? (
        <>
          <Text style={styles.userId}>{currentUser.id}</Text>
          <TouchableOpacity onPress={handleLogout}>
            <Text style={styles.headerButton}>로그아웃</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TouchableOpacity onPress={() => navigation.navigate('로그인')}>
            <Text style={styles.headerButton}>로그인</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('회원가입')}>
            <Text style={styles.headerButton}>회원가입</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

// 로그인 화면
const LoginScreen = ({ navigation, users, setUsers, setCurrentUser }) => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = () => {
    const user = users.find((user) => user.id === id && user.password === password);
    if (user) {
      setErrorMessage('');
      setCurrentUser(user); 
      navigation.goBack();
    } else {
      setErrorMessage('회원이 아닙니다. 아이디 또는 비밀번호를 확인해주세요.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>로그인</Text>
      <TextInput style={styles.input} placeholder="아이디" value={id} onChangeText={setId} />
      <TextInput style={styles.input} placeholder="비밀번호" secureTextEntry value={password} onChangeText={setPassword} />
      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
      <Button title="로그인" onPress={handleLogin} />
      <TouchableOpacity onPress={() => navigation.navigate('회원가입')}>
        <Text style={styles.linkText}>회원가입</Text>
      </TouchableOpacity>
    </View>
  );
};

// 회원가입 화면
const SignUpScreen = ({ navigation, setUsers }) => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignUp = () => {
    if (password !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    const newUser = { id, password };
    setUsers((prevUsers) => [...prevUsers, newUser]);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>회원가입</Text>
      <TextInput style={styles.input} placeholder="아이디" value={id} onChangeText={setId} />
      <TextInput style={styles.input} placeholder="비밀번호" secureTextEntry value={password} onChangeText={setPassword} />
      <TextInput style={styles.input} placeholder="비밀번호 확인" secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} />
      <Button title="회원가입" onPress={handleSignUp} />
    </View>
  );
};

// 게시판 화면
const BoardScreen = ({ posts, setPosts, navigation, currentUser }) => {
  const handleDeletePost = (postId, postUserId) => {
    if (postUserId === currentUser.id) {  // 로그인한 사용자가 작성한 게시글만 삭제 가능
      const updatedPosts = posts.filter((post) => post.id !== postId);
      setPosts(updatedPosts);
    } else {
      alert("자신의 게시글만 삭제할 수 있습니다.");
    }
  };

  const handleRecommendPost = (postId) => {
    if (!currentUser) {
      alert('로그인이 필요합니다.');
      return;
    }

    const updatedPosts = posts.map((post) => {
      if (post.id === postId) {
    
        if (post.recommendedBy.includes(currentUser.id)) {
          alert('이미 추천했습니다.'); 
          return post; 
        }

        
        return {
          ...post,
          recommendations: post.recommendations + 1,
          recommendedBy: [...post.recommendedBy, currentUser.id], 
        };
      }
      return post;
    });

    setPosts(updatedPosts);
  };

  return (
    <View style={styles.container}>
      <Button title="글쓰기" onPress={() => navigation.navigate('게시글 작성')} />
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.post}>
            <TouchableOpacity onPress={() => navigation.navigate('게시글 상세', { post: item })}>
              <Text style={styles.postTitle}>{item.title}</Text>
              <Text style={styles.postContent}>{item.content}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleRecommendPost(item.id)} >
              <Text style={styles.recommendButton}>
                추천 ({item.recommendations}) {item.recommendedBy.includes(currentUser?.id) ? '(이미 추천함)' : ''}
              </Text>
            </TouchableOpacity>
            {item.userId === currentUser?.id && (  
              <TouchableOpacity onPress={() => handleDeletePost(item.id, item.userId)} >
                <Text style={styles.deleteButton}>삭제</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      />
    </View>
  );
};

// 게시글 작성 화면
const WriteScreen = ({ posts, setPosts, navigation, currentUser }) => {
  if (!currentUser) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>로그인 후 글을 작성할 수 있습니다.</Text>
        <Button title="로그인" onPress={() => navigation.navigate('로그인')} />
      </View>
    );
  }

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleAddPost = () => {
    if (title && content) {
      const newPost = {
        id: Date.now().toString(),
        title,
        content,
        recommendations: 0,
        recommendedBy: [], 
        comments: [],
        userId: currentUser ? currentUser.id : null,  
      };
      setPosts([newPost, ...posts]);
      navigation.goBack();
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.label}>제목</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="제목을 입력하세요"
      />
      <Text style={styles.label}>내용</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={content}
        onChangeText={setContent}
        placeholder="내용을 입력하세요"
        multiline
      />
      <Button title="업로드" onPress={handleAddPost} />
    </View>
  );
};

// 게시글 상세 화면
const PostDetailScreen = ({ post, posts, setPosts, navigation, currentUser }) => {
  const [comment, setComment] = useState('');

  const handleAddComment = () => {
    if (comment.trim()) {
      const newComment = {
        id: Date.now().toString(),
        userId: currentUser.id,  
        content: comment,
      };
      const updatedPost = { ...post, comments: [...post.comments, newComment] };
      const updatedPosts = posts.map((p) => (p.id === post.id ? updatedPost : p));
      setPosts(updatedPosts);
      setComment('');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{post.title}</Text>
      <Text style={styles.content}>{post.content}</Text>
      <Text style={styles.subTitle}>댓글</Text>
      <FlatList
        data={post.comments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.comment}>
            <Text style={styles.commentUser}>{item.userId}</Text>
            <Text style={styles.commentContent}>{item.content}</Text>
          </View>
        )}
      />
      {currentUser ? (
        <>
          <TextInput
            style={styles.input}
            placeholder="댓글을 작성하세요"
            value={comment}
            onChangeText={setComment}
          />
          <Button title="댓글 작성" onPress={handleAddComment} />
        </>
      ) : (
        <Text style={styles.errorText}>로그인 후 댓글을 작성할 수 있습니다.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 16,
    paddingLeft: 8,
  },
  textArea: {
    height: 100,
  },
  post: {
    marginBottom: 16,
    borderBottomWidth: 1,
    paddingBottom: 8,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  postContent: {
    fontSize: 14,
  },
  errorText: {
    color: 'red',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  headerButton: {
    marginLeft: 10,
    color: 'blue',
  },
  userId: {
    marginRight: 10,
    fontWeight: 'bold',
  },
  linkText: {
    color: 'blue',
    textAlign: 'center',
    marginTop: 10,
  },
  recommendButton: {
    color: 'green',
  },
  deleteButton: {
    color: 'red',
    marginTop: 8,
  },
  subTitle: {
    fontSize: 16,
    marginVertical: 8,
  },
  comment: {
    paddingVertical: 8,
  },
  commentUser: {
    fontWeight: 'bold',
  },
  commentContent: {
    fontSize: 14,
  },
});

export default App;
