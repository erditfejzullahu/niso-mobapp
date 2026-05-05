import TextField from '@/components/TextField';
import api from '@/hooks/useApi';
import Toast from '@/utils/appToast';
import { Frown, Laugh, Meh, Smile, Star, X } from 'lucide-react-native';
import React, { memo, useCallback, useState } from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

interface Props {
    visible: boolean;
    onClose: () => void;
    driverId: string;
    driverFullName: string;
    connectedRideId: string;
    onSuccess?: () => void;
}

const RATING_OPTIONS = [
    { icon: Frown, label: 'Shumë Keq', value: 1, color: '#DC2626' },
    { icon: Meh,   label: 'Keq',       value: 2, color: '#F97316' },
    { icon: Smile, label: 'Mirë',      value: 3, color: '#EAB308' },
    { icon: Laugh, label: 'Shumë Mirë',value: 4, color: '#10B981' },
    { icon: Star,  label: 'Perfekt',   value: 5, color: '#3B82F6' },
];

function ConnectedRideReviewModal({ visible, onClose, driverId, driverFullName, connectedRideId, onSuccess }: Props) {
    const [rating, setRating] = useState<number | null>(null);
    const [description, setDescription] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const reset = useCallback(() => {
        setRating(null);
        setDescription('');
    }, []);

    const close = useCallback(() => {
        if (submitting) return;
        reset();
        onClose();
    }, [submitting, onClose, reset]);

    const submit = useCallback(async () => {
        if (!rating) {
            Toast.show({ type: 'error', text1: 'Gabim', text2: 'Ju lutem zgjedhni një vlerësim 1–5.' });
            return;
        }
        try {
            setSubmitting(true);
            const res = await api.post('/reviews/make-review', {
                driverId,
                connectedRideId,
                reviewContent: description,
                rating,
            });
            if (res.data?.success) {
                Toast.show({ type: 'success', text1: 'Sukses', text2: `Ju vlerësuat shoferin ${driverFullName}.` });
                reset();
                onClose();
                onSuccess?.();
            }
        } catch (err: any) {
            Toast.show({
                type: 'error',
                text1: 'Gabim',
                text2: err?.response?.data?.message || 'Diçka shkoi gabim. Provoni përsëri.',
            });
        } finally {
            setSubmitting(false);
        }
    }, [rating, description, driverId, connectedRideId, driverFullName, onClose, onSuccess, reset]);

    return (
        <Modal visible={visible} animationType="slide" transparent onRequestClose={close}>
            <View className="flex-1 bg-black/40 justify-center items-center">
                <View className="bg-white rounded-xl p-5 w-11/12">
                    <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
                        <View className="flex-row items-center justify-between mb-2">
                            <Text className="text-lg font-psemibold text-indigo-950">Vlerësoni shoferin</Text>
                            <TouchableOpacity onPress={close} disabled={submitting}>
                                <X color="#4f46e5" />
                            </TouchableOpacity>
                        </View>

                        <Text className="text-indigo-950 text-sm font-pregular mb-1">
                            Vlerësoni shoferin <Text className="text-indigo-600 font-psemibold">{driverFullName}</Text> me sinqeritet.
                        </Text>
                        <Text className="font-psemibold text-xs text-red-600 mb-3">
                            Çdo vlerësim i rrejshëm rezulton në pezullim të llogarisë.
                        </Text>

                        <View className="flex-row justify-between mb-3">
                            {RATING_OPTIONS.map((item) => (
                                <TouchableOpacity
                                    key={item.value}
                                    onPress={() => setRating(item.value)}
                                    className={`items-center flex-1 ${rating === item.value ? 'opacity-100' : 'opacity-60'}`}
                                >
                                    <item.icon size={32} color={item.color} />
                                    <Text className="text-xs mt-1 text-gray-700 font-pregular text-center">{item.label}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <View className="mb-3">
                            <TextField
                                title="Më shumë informata (opsionale)"
                                placeholder="Këtu mund të shkruani informata rreth vlerësimit..."
                                value={description}
                                onChangeText={setDescription}
                                multiline
                            />
                        </View>

                        {rating !== null && (
                            <Text className="text-xs font-pregular text-indigo-950 mb-3">
                                Po vlerësoni shoferin <Text className="text-indigo-600 font-psemibold">{driverFullName}</Text>{' '}
                                me <Text className="text-red-600 font-psemibold">{rating}</Text>.
                            </Text>
                        )}

                        <TouchableOpacity
                            onPress={submit}
                            disabled={submitting}
                            className={`px-4 py-2 rounded-lg flex-row items-center justify-center gap-1 ${submitting ? 'bg-indigo-300' : 'bg-indigo-600'}`}
                        >
                            <Text className="text-white font-pmedium">
                                {submitting ? 'Duke dërguar...' : 'Dërgoni vlerësimin'}
                            </Text>
                            <Star color="white" size={18} />
                        </TouchableOpacity>
                    </KeyboardAwareScrollView>
                </View>
            </View>
        </Modal>
    );
}

export default memo(ConnectedRideReviewModal);
