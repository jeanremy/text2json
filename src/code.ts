import slugify from "../node_modules/slugify/slugify";
import { merge } from "lodash";

const texts = figma.currentPage.findAll((node) => node.type === "TEXT");
const strings = {};
texts.map((text) => {
  const textObj = getTextObject(text.parent, text);
  merge(strings, textObj);
});

// check if text is on frame or page
function getTextObject(parent, text) {
  if (parent.type && parent.type === "FRAME") {
    return {
      screen: {
        [clean(parent.name)]: {
          [getName(text)]: text.characters,
        },
      },
    };
  } else if (parent.type && parent.type === "PAGE") {
    return null;
  }

  return getTextObject(parent.parent, text);
}

function getName(node: TextNode) {
  if (node.autoRename) {
    return clean(node.id);
  }
  return `${clean(node.name)}-${node.id}`;
}

function clean(string: String) {
  return slugify(string.toLowerCase());
}

figma.showUI(`<code>${JSON.stringify(strings)}</code>`);
