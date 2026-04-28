import { X } from 'lucide-react-native';
import React, { memo, useCallback } from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';

type Props = {
    visible: boolean;
    onClose: () => void;
    /** Not wired to API yet — called when user confirms in the modal. */
    onConfirmTakeRide: () => void;
};

const TakeRideConfirmModal = memo(function TakeRideConfirmModal({ visible, onClose, onConfirmTakeRide }: Props) {
    const handleConfirm = useCallback(() => {
        onConfirmTakeRide();
        onClose();
    }, [onConfirmTakeRide, onClose]);

    return (
        <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
            <View className="flex-1 bg-black/40 justify-center items-center px-4">
                <View className="bg-white rounded-xl p-5 w-full max-w-md">
                    <View className="flex-row justify-between items-start mb-3">
                        <Text className="text-lg font-psemibold text-indigo-950 flex-1 pr-2">
                            Konfirmo marrjen e udhëtimit
                        </Text>
                        <TouchableOpacity onPress={onClose} accessibilityLabel="Mbyll">
                            <X size={22} color="#374151" />
                        </TouchableOpacity>
                    </View>
                    <Text className="text-gray-700 text-xs font-pregular mb-5 leading-relaxed">
                        Duke konfirmuar, ju pranoni përgjegjësinë për transportimin e pasagjerit sipas destinacionit të përcaktuar.
                        Mund të respektohen kushte dhe tarifa kur lidhen me palën tjetër — funksioni i përfundimit të kësaj veprime
                        do të shtohet së shpejti.
                    </Text>
                    <View className="flex-row justify-end gap-3">
                        <TouchableOpacity onPress={onClose} className="px-4 py-2.5 rounded-lg bg-gray-100">
                            <Text className="text-gray-800 font-pmedium">Anulo</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleConfirm} className="px-4 py-2.5 rounded-lg bg-indigo-600">
                            <Text className="text-white font-psemibold">Konfirmo</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
});

export default TakeRideConfirmModal;
