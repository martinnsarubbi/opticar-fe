/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

 import { getDefaultConfig } from "metro-config";

 export default (async () => {
   const {
     resolver: { assetExts }
   } = await getDefaultConfig();
 
   return {
     transformer: {
       getTransformOptions: async () => ({
         transform: {
           experimentalImportSupport: false,
           inlineRequires: true,
         },
       }),
     },
     resolver: {
       assetExts: [...assetExts, "obj", "mtl", "JPG", "vrx", "hdr", "gltf", "glb", "bin", "arobject", "gif"]
     }
   }
 })();
 