import Text "mo:base/Text";
import LLM "mo:llm";

actor Chatbot {
    type Result<T, E> = { #Ok : T; #Err : E };

    public func prompt(prompt : Text) : async Result<Text, Text> {
        let command = "You are Lumora Assistant, an AI guide for sustainable actions and rewards. Only respond to questions about eco-friendly actions, LUM tokens, sustainability projects, and environmental impact. If the question is unrelated, say: 'Sorry, I can only assist with eco-friendly actions and sustainability topics.' Keep the response concise and under 1000 characters.";
        let response = await LLM.prompt(#Llama3_1_8B, command # " " # prompt);
        return #Ok(response);
    };
}