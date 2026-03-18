import { Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Colors } from "@/constants/theme";

type CreatePlaylistModalProps = {
  visible: boolean;
  value: string;
  onChangeText: (text: string) => void;
  onClose: () => void;
  onCreate: () => void;
};

export function CreatePlaylistModal({
  visible,
  value,
  onChangeText,
  onClose,
  onCreate,
}: CreatePlaylistModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
          <Text style={styles.modalTitle}>New Playlist</Text>
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={onChangeText}
            placeholder="Playlist name"
            placeholderTextColor={Colors.text.muted}
            autoFocus
          />
          <View style={styles.modalActions}>
            <Pressable
              style={[styles.modalBtn, styles.modalBtnCancel]}
              onPress={onClose}
            >
              <Text style={styles.modalBtnTextCancel}>Cancel</Text>
            </Pressable>
            <Pressable
              style={[styles.modalBtn, styles.modalBtnConfirm]}
              onPress={onCreate}
            >
              <Text style={styles.modalBtnTextConfirm}>Create</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalContent: {
    width: "100%",
    maxWidth: 340,
    backgroundColor: Colors.background.card,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border.primary,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text.primary,
    marginBottom: 16,
  },
  input: {
    backgroundColor: Colors.background.app,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.text.primary,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border.primary,
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  modalBtnCancel: {
    backgroundColor: Colors.background.app,
    borderWidth: 1,
    borderColor: Colors.border.primary,
  },
  modalBtnConfirm: {
    backgroundColor: Colors.button.primary,
  },
  modalBtnTextCancel: { color: Colors.text.primary, fontWeight: "600" },
  modalBtnTextConfirm: { color: Colors.button.text, fontWeight: "700" },
});
