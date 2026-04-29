import React from 'react';
import { Modal, Pressable, Text, View } from 'react-native';

type Props = {
    visible: boolean;
    title?: string;
    message?: string;
    cancelText?: string;
    confirmText?: string;
    confirmVariant?: 'default' | 'destructive';
    dismissOnBackdropPress?: boolean;
    onCancel: () => void;
    onConfirm: () => void;
};

export default function ConfirmActionModal({
    visible,
    title = 'Jeni i sigurt?',
    message = 'Ky veprim nuk mund të kthehet mbrapsht.',
    cancelText = 'Anulo',
    confirmText = 'Vazhdo',
    confirmVariant = 'default',
    dismissOnBackdropPress = true,
    onCancel,
    onConfirm,
}: Props) {
    const confirmClassName =
        confirmVariant === 'destructive'
            ? 'bg-red-600 active:bg-red-700'
            : 'bg-indigo-600 active:bg-indigo-700';

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            statusBarTranslucent
            onRequestClose={onCancel}
        >
            <View className="flex-1 items-center justify-center px-5">
                <Pressable
                    className="absolute inset-0 bg-black/50"
                    onPress={dismissOnBackdropPress ? onCancel : undefined}
                />

                <View className="w-full max-w-[420px] rounded-2xl bg-white p-4 shadow-2xl shadow-black/30">
                    <Text className="font-psemibold text-indigo-950 text-base">{title}</Text>
                    <Text className="font-pregular text-indigo-900/90 text-sm mt-1">{message}</Text>

                    <View className="flex-row gap-2 mt-4">
                        <Pressable
                            onPress={onCancel}
                            className="flex-1 rounded-xl bg-gray-100 active:bg-gray-200 py-2.5 items-center"
                        >
                            <Text className="font-pmedium text-indigo-950">{cancelText}</Text>
                        </Pressable>

                        <Pressable onPress={onConfirm} className={`flex-1 rounded-xl py-2.5 items-center ${confirmClassName}`}>
                            <Text className="font-pmedium text-white">{confirmText}</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

