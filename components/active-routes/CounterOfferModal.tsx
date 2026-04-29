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
    passengerPriceLabel: string;
    /** Not wired to API — receives the amount and optional message. */
    onSubmitCounterOffer: (amountEuro: string, message?: string) => void;
};

const CounterOfferModal = memo(function CounterOfferModal({
    visible,
    onClose,
    passengerPriceLabel,
    onSubmitCounterOffer,
}: Props) {
    const [amount, setAmount] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = useCallback(() => {
        const trimmed = amount.trim();
        if (!trimmed) return;
        const messageTrimmed = message.trim();
        onSubmitCounterOffer(trimmed, messageTrimmed ? messageTrimmed : undefined);
        setAmount('');
        setMessage('');
        onClose();
    }, [amount, message, onClose, onSubmitCounterOffer]);

    const amountTrimmed = amount.trim();
    const canSubmit = amountTrimmed.length > 0;

    return (
        <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1 bg-black/40 justify-center px-4"
            >
                <View className="bg-white rounded-xl p-5 w-full max-w-md max-h-[85%] self-center">
                    <View className="flex-row justify-between items-start mb-2">
                        <Text className="text-lg font-psemibold text-indigo-950 flex-1 pr-2">
                            Kontraofertë
                        </Text>
                        <TouchableOpacity onPress={onClose} accessibilityLabel="Mbyll">
                            <X size={22} color="#374151" />
                        </TouchableOpacity>
                    </View>
                    <Text className="text-gray-600 text-xs font-pregular mb-3">
                        Pasagjeri ka përcaktuar një çmim. Mund të propozoni një çmim tjetër (€).
                    </Text>
                    <View className="bg-indigo-50 rounded-lg px-3 py-2 mb-4">
                        <Text className="text-[11px] text-indigo-800 font-pregular">Çmimi i pasagjerit</Text>
                        <Text className="text-base font-psemibold text-indigo-950">{passengerPriceLabel}</Text>
                    </View>
                    <Text className="text-xs text-gray-500 mb-1">Çmimi juaj i propozuar (€)</Text>
                    <TextInput
                        value={amount}
                        onChangeText={setAmount}
                        keyboardType="decimal-pad"
                        placeholder="p.sh. 12.50"
                        placeholderTextColor="#9ca3af"
                        className="border border-gray-200 rounded-lg px-3 py-2.5 text-base font-pregular text-gray-900 mb-5"
                    />
                    <Text className="text-xs text-gray-500 mb-1">Mesazh (opsional)</Text>
                    <TextInput
                        value={message}
                        onChangeText={setMessage}
                        placeholder="p.sh. Jam afër dhe mund të nisem menjëherë."
                        placeholderTextColor="#9ca3af"
                        multiline
                        className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-pregular text-gray-900 mb-5 min-h-[80px]"
                    />
                    <View className="flex-row justify-end gap-3">
                        <TouchableOpacity onPress={onClose} className="px-4 py-2.5 rounded-lg bg-gray-100">
                            <Text className="text-gray-800 font-pmedium">Anulo</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={handleSubmit}
                            disabled={!canSubmit}
                            className={`px-4 py-2.5 rounded-lg bg-indigo-600 ${!canSubmit ? 'opacity-50' : ''}`}
                        >
                            <Text className="text-white font-psemibold">Dërgo kontraofertën</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
});

export default CounterOfferModal;
