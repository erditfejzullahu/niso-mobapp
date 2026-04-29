import { X } from 'lucide-react-native';
import React, { memo, useCallback, useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';

type Props = {
    visible: boolean;
    onClose: () => void;
    /** Not wired to API yet — called when the driver confirms sending the “ready” signal. */
    onConfirmNotifyPassengerReady: (message?: string) => void;
};

const TakeRideConfirmModal = memo(function TakeRideConfirmModal({ visible, onClose, onConfirmNotifyPassengerReady }: Props) {
    const [message, setMessage] = useState('');

    const handleConfirm = useCallback(() => {
        const trimmed = message.trim();
        onConfirmNotifyPassengerReady(trimmed ? trimmed : undefined);
        setMessage('');
        onClose();
    }, [message, onConfirmNotifyPassengerReady, onClose]);

    return (
        <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1 bg-black/40 justify-center items-center px-4"
            >
                <View className="bg-white rounded-xl p-5 w-full max-w-md max-h-[85%]">
                    <View className="flex-row justify-between items-start mb-3">
                        <Text className="text-lg font-psemibold text-indigo-950 flex-1 pr-2">
                            Njoftimi i gatishmërisë
                        </Text>
                        <TouchableOpacity onPress={onClose} accessibilityLabel="Mbyll">
                            <X size={22} color="#374151" />
                        </TouchableOpacity>
                    </View>
                    <Text className="text-gray-700 text-xs font-pregular mb-5 leading-relaxed">
                        Po dërgoni një njoftim te pasagjeri: se jeni në dispozicion dhe gati për nisje. Kjo nuk është pranim
                        përfundimtar i udhëtimit — është një sinjal që pasagjeri mund të vlerësojë bashkë me kushtet dhe
                        komunikimin e mëtejshëm. Lidhja me serverin dhe hapat e ardhshëm do të shtohen së shpejti.
                    </Text>
                    <Text className="text-xs text-gray-500 mb-1">Mesazh (opsional)</Text>
                    <TextInput
                        value={message}
                        onChangeText={setMessage}
                        placeholder="p.sh. Jam 3 minuta larg dhe mund të nisem tani."
                        placeholderTextColor="#9ca3af"
                        multiline
                        className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-pregular text-gray-900 mb-5 min-h-[80px]"
                    />
                    <View className="flex-row justify-end gap-3">
                        <TouchableOpacity onPress={onClose} className="px-4 py-2.5 rounded-lg bg-gray-100">
                            <Text className="text-gray-800 font-pmedium">Anulo</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleConfirm} className="px-4 py-2.5 rounded-lg bg-indigo-600">
                            <Text className="text-white font-psemibold">Dërgo njoftimin</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
});

export default TakeRideConfirmModal;
