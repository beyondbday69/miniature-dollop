import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:livekit_client/livekit_client.dart';
import 'package:permission_handler/permission_handler.dart';

void main() {
  runApp(const VoxLinkApp());
}

class VoxLinkApp extends StatelessWidget {
  const VoxLinkApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'VOXLINK',
      theme: ThemeData.dark().copyWith(
        primaryColor: Colors.white,
        scaffoldBackgroundColor: const Color(0xFF000000),
        colorScheme: const ColorScheme.dark(
          primary: Colors.white,
          secondary: Color(0xFF353535),
        ),
      ),
      home: const JoinScreen(),
    );
  }
}

class JoinScreen extends StatefulWidget {
  const JoinScreen({super.key});

  @override
  State<JoinScreen> createState() => _JoinScreenState();
}

class _JoinScreenState extends State<JoinScreen> {
  final _userController = TextEditingController();
  final _roomController = TextEditingController();
  bool _isLoading = false;

  Future<void> _handleJoin() async {
    final userName = _userController.text.trim();
    final roomName = _roomController.text.trim();

    if (userName.isEmpty || roomName.isEmpty) return;

    setState(() => _isLoading = true);

    try {
      await Permission.microphone.request();

      final baseUrl = 'https://vcrepo.vercel.app';
      final response = await http.get(
        Uri.parse('$baseUrl/api/get-token?room=$roomName&user=$userName'),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final token = data['token'];

        if (!mounted) return;

        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => RoomScreen(
              token: token,
              roomName: roomName,
              userName: userName,
            ),
          ),
        );
      } else {
        throw Exception('Failed to get token');
      }
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error: ${e.toString()}')),
      );
    } finally {
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        padding: const EdgeInsets.symmetric(horizontal: 30),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const Icon(Icons.mic, size: 80, color: Colors.white),
            const SizedBox(height: 20),
            const Text(
              'VOXLINK',
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 40,
                fontWeight: FontWeight.w900,
                letterSpacing: 4,
                fontFamily: 'serif',
              ),
            ),
            const SizedBox(height: 10),
            const Text(
              'PREMIUM VOICE CONTROL',
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 12, color: Colors.grey, letterSpacing: 2),
            ),
            const SizedBox(height: 50),
            TextField(
              controller: _userController,
              decoration: const InputDecoration(
                labelText: 'IDENTIFICATION',
                prefixIcon: Icon(Icons.person),
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 20),
            TextField(
              controller: _roomController,
              decoration: const InputDecoration(
                labelText: 'ACCESS ROOM',
                prefixIcon: Icon(Icons.tag),
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 40),
            ElevatedButton(
              onPressed: _isLoading ? null : _handleJoin,
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.white,
                foregroundColor: Colors.black,
                padding: const EdgeInsets.symmetric(vertical: 20),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
              child: _isLoading
                  ? const CircularProgressIndicator(color: Colors.black)
                  : const Text('ESTABLISH LINK',
                      style: TextStyle(fontWeight: FontWeight.bold, letterSpacing: 1.5)),
            ),
          ],
        ),
      ),
    );
  }
}

class RoomScreen extends StatefulWidget {
  final String token;
  final String roomName;
  final String userName;

  const RoomScreen({
    super.key,
    required this.token,
    required this.roomName,
    required this.userName,
  });

  @override
  State<RoomScreen> createState() => _RoomScreenState();
}

class _RoomScreenState extends State<RoomScreen> {
  Room? _room;

  @override
  void initState() {
    super.initState();
    _connect();
  }

  Future<void> _connect() async {
    _room = Room();
    try {
      await _room!.connect('wss://wasd-9bjnbp7j.livekit.cloud', widget.token);
      // FIX 1: localParticipant nullable — use ?.
      await _room!.localParticipant?.setMicrophoneEnabled(true);
      setState(() {});
    } catch (e) {
      debugPrint('Could not connect: $e');
    }
  }

  @override
  void dispose() {
    _room?.disconnect();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.roomName.toUpperCase()),
        actions: [
          IconButton(
            icon: const Icon(Icons.phone_disabled, color: Colors.red),
            onPressed: () => Navigator.pop(context),
          ),
        ],
      ),
      body: _room == null
          ? const Center(child: CircularProgressIndicator())
          : ListView.builder(
              padding: const EdgeInsets.all(20),
              // FIX 2: participants → remoteParticipants
              itemCount: _room!.remoteParticipants.length + 1,
              itemBuilder: (context, index) {
                if (index == 0) {
                  // FIX 3: localParticipant! (non-null assert)
                  return ParticipantTile(
                      participant: _room!.localParticipant!, isLocal: true);
                }
                final p = _room!.remoteParticipants.values.elementAt(index - 1);
                return ParticipantTile(participant: p);
              },
            ),
    );
  }
}

class ParticipantTile extends StatelessWidget {
  final Participant participant;
  final bool isLocal;

  const ParticipantTile({super.key, required this.participant, this.isLocal = false});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 15),
      padding: const EdgeInsets.all(15),
      decoration: BoxDecoration(
        color: const Color(0xFF151515),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.white10),
      ),
      child: Row(
        children: [
          CircleAvatar(
            backgroundColor: isLocal ? Colors.white : Colors.grey,
            child: Text(
              participant.identity.isNotEmpty
                  ? participant.identity[0].toUpperCase()
                  : '?',
              style: const TextStyle(color: Colors.black),
            ),
          ),
          const SizedBox(width: 15),
          Expanded(
            child: Text(
              '${participant.identity} ${isLocal ? "(You)" : ""}',
              style: const TextStyle(fontWeight: FontWeight.bold),
            ),
          ),
          Icon(
            participant.isMicrophoneEnabled() ? Icons.mic : Icons.mic_off,
            color: participant.isMicrophoneEnabled() ? Colors.green : Colors.red,
            size: 20,
          ),
        ],
      ),
    );
  }
}
