import { useState } from "react";
import { Button, Modal, Text, TouchableHighlight, TouchableOpacity, View } from "react-native";

export default function Dialog({
  children,
  title,
  description,
  cancelBtnText = "Cancel",
  proceedBtnText = "Proceed",
  action,
}) {
  const [visible, setVisible] = useState(false);
  const toggleVisibility = () => setVisible((prev) => !prev);
  const handleBtnPress = () => {
    action();
    toggleVisibility();
  };

  const ModalBtn = ({ text, variant, onPress }) => {
    return (
      <TouchableOpacity onPress={onPress} className="bg-black-200 flex-1 p-3">
        <Text
          className={`text-center text-lg ${
            variant === "danger" ? "text-red-500" : "text-gray-100"
          }`}
        >
          {text}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View>
      {/*Toggle Btn*/}
      <TouchableOpacity onPress={toggleVisibility}>{children}</TouchableOpacity>

      <Modal visible={visible} animationType="fade" transparent={true}>
        <TouchableOpacity
          onPressOut={toggleVisibility}
          className="top-0 right-0 left-0 bottom-0 absolute justify-center items-center"
        >
          <View className="bg-white bg-black-200 rounded-2xl">
            <View className="pb-3 pt-7 px-7">
              <Text className="text-2xl font-pbold text-gray-50 mb-3">{title}</Text>
              <Text className="text-base text-gray-100">{description}</Text>
            </View>
            <View className="flex-row border-t border-black-100 rounded-b-2xl overflow-hidden">
              <ModalBtn text={cancelBtnText} onPress={toggleVisibility} />
              <View className="h-full border-l border-black-100" />
              <ModalBtn text={proceedBtnText} onPress={handleBtnPress} variant="danger" />
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
