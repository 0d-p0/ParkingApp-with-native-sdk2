import React, { useState } from 'react';
import { TextInput, View, Button } from 'react-native';

const CapitalizedTextInput = () => {
  const [text, setText] = useState('');

  const handleTextChange = (inputText) => {
    const capitalizedText = capitalizeText(inputText);
    setText(capitalizedText);
  };

  const capitalizeText = (inputText) => {
    if (inputText.length === 0) return ''; // Return empty string for an empty input

    // Capitalize all words
    return inputText
      .split(' ')
      .map((word) => word.toUpperCase())
      .join(' ');
  };

  const handleSubmit = () => {
    // Perform submission logic with the capitalized text
    console.log('Capitalized text:', text);
  };

  return (
    <View>
      <TextInput
        placeholder="Enter text"
        onChangeText={handleTextChange}
        value={text}
      />
      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
};

export default CapitalizedTextInput;
