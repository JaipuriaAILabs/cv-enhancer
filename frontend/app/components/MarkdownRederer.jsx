import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

// Preprocess the markdown to wrap snippets with colored spans
const colorizeSnippets = (markdown, snippets) => {
//   console.log(typeof snippets)
  let colors = ["red", "blue", "green", "purple", "orange"];
  let coloredMarkdown = markdown;
  if(typeof snippets === "string"){
    console.log("string")
    return markdown
  }
  snippets.forEach((snippet, index) => {
    const color = colors[index % colors.length];
    const coloredSpan = `<span class="highlight" style="background-color: ${color};">${snippet.snippet}</span>`;
    coloredMarkdown = coloredMarkdown.replaceAll(snippet.snippet, coloredSpan);
  });
  return coloredMarkdown;
};

const MarkdownRenderer = ({markdown, snippets}) => {

    console.log(snippets)


  const coloredMarkdown = colorizeSnippets(markdown, JSON.parse(snippets.replace(/^```json\s*|\s*```$/g, '')));

  return (
    <div className="p-4 overflow-y-scroll h-screen">
      <ReactMarkdown rehypePlugins={[rehypeRaw]} className="prose">{coloredMarkdown}</ReactMarkdown>

    </div>
  );
};

export default MarkdownRenderer;


