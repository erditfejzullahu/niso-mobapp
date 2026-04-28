import { X } from 'lucide-react-native';
import React, { memo, useCallback, useState } from 'react';
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

type Props = {
    visible: boolean;
    onClose: () => void;
    /** Not wired to API — receives the amount the driver entered. */
    onSubmitDriverOffer: (amountEuro: string) => void;
};

const DriverOfferModal = memo(function DriverOfferModal({ visible, onClose, onSubmitDriverOffer }: Props) {
    const [amount, setAmount] = useState('');

    const handleSubmit = useCallback(() => {
        const trimmed = amount.trim();
        onSubmitDriverOffer(trimmed);
        setAmount('');
        onClose();
    }, [amount, onClose, onSubmitDriverOffer]);

    return (
        <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1 bg-black/40 justify-center px-4"
            >
                <View className="bg-white rounded-xl p-5 w-full max-w-md max-h-[85%] self-center">
                    <View className="flex-row justify-between items-start mb-2">
                        <Text className="text-lg font-psemibold text-indigo-950 flex-1 pr-2">Oferta juaj</Text>
                        <TouchableOpacity onPress={onClose} accessibilityLabel="Mbyll">
                            <X size={22} color="#374151" />
                        </TouchableOpacity>
                    </View>
                    <Text className="text-gray-600 text-xs font-pregular mb-4 leading-relaxed">
                        Për këtë kërkesë nuk është përcaktuar një çmim fiks nga pasagjeri — çmimi llogaritet sipas distancës
                        sipas politikës së platformës. Mund të propozoni një shumë që dëshironi të negocioni me pasagjerin.
                        Dërgimi i ofertës do të aktivizohet kur të lidhet me serverin.
                    </Text>
                    <Text className="text-xs text-gray-500 mb-1">Shuma e propozuar (€)</Text>
                    <TextInput
                        value={amount}
                        onChangeText={setAmount}
                        keyboardType="decimal-pad"
                        placeholder="p.sh. 8.00"
                        placeholderTextColor="#9ca3af"
                        className="border border-gray-200 rounded-lg px-3 py-2.5 text-base font-pregular text-gray-900 mb-5"
                    />
                    <View className="flex-row justify-end gap-3">
                        <TouchableOpacity onPress={onClose} className="px-4 py-2.5 rounded-lg bg-gray-100">
                            <Text className="text-gray-800 font-pmedium">Anulo</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleSubmit} className="px-4 py-2.5 rounded-lg bg-indigo-600">
                            <Text className="text-white font-psemibold">Dërgo ofertën</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
});

export default DriverOfferModal;
