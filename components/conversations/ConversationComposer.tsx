import React, { memo } from 'react';
import { Pressable, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { BounceInDown } from 'react-native-reanimated';
import { Send } from 'lucide-react-native';
import type { Conversations } from '@/types/app-types';
import ConfirmActionModal from '@/components/ui/ConfirmActionModal';
import { useReopenResolvedConversation } from '@/hooks/conversations/useReopenResolvedConversation';

type Props = {
    conversation: Conversations;
    draftMessage: string;
    isResolved: boolean;
    onDraftChange: (text: string) => void;
    onSend: () => void;
    onConversationReopened: () => void;
};

export default memo(function ConversationComposer({
    conversation,
    draftMessage,
    isResolved,
    onDraftChange,
    onSend,
    onConversationReopened,
}: Props) {
    const {
        reopenModalOpen,
        isReopening,
        openReopenModal,
        cancelReopen,
        confirmReopen,
    } = useReopenResolvedConversation({
        conversationId: conversation.id,
        isResolved,
        onConversationReopened,
    });

    return (
        <>
            <Animated.View entering={BounceInDown.duration(800)} className="border-t border-gray-200 p-3 bg-white">
                <View className="flex-row items-center">
                    {isResolved ? (
                        <Pressable
                            className="flex-1 rounded-full px-4 py-2 bg-slate-200"
                            onPress={openReopenModal}
                        >
                            <Text className="text-sm font-pregular text-slate-600">Biseda eshte e kryer.</Text>
                        </Pressable>
                    ) : (
                        <TextInput
                            placeholder="Shkruaj një mesazh..."
                            className="flex-1 rounded-full px-4 py-2 text-sm font-pregular bg-gray-100 text-indigo-950"
                            multiline
                            value={draftMessage}
                            onChangeText={onDraftChange}
                        />
                    )}
                    <TouchableOpacity
                        disabled={isResolved}
                        className={`ml-2 rounded-full p-2 ${isResolved ? 'bg-slate-400' : 'bg-indigo-600'}`}
                        onPress={onSend}
                    >
                        <Send size={18} color="#fff" />
                    </TouchableOpacity>
                </View>
                {isResolved && (
                    <Pressable onPress={openReopenModal}>
                        <Text className="font-pregular text-[11px] text-slate-600 mt-2 px-2">
                            Per te filluar biseden perseri klikoni ne fushen per shkruarjen e mesazhit.
                        </Text>
                    </Pressable>
                )}
            </Animated.View>

            <ConfirmActionModal
                visible={reopenModalOpen}
                title="Hape bisedën përsëri?"
                message="Biseda është e kryer. Konfirmoni nëse dëshironi ta hapni përsëri për të kontaktuar këtë person."
                cancelText="Anulo"
                confirmText="Hape"
                isConfirming={isReopening}
                dismissOnBackdropPress={!isReopening}
                onCancel={cancelReopen}
                onConfirm={() => void confirmReopen()}
            />
        </>
    );
})