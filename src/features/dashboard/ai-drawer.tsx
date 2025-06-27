import { useEmbedDrawer, useApplicationToken } from "@1f/react-sdk";
import { Box, Button, Drawer, Title, IconButton, VaporIcon } from "@vapor/v3-components"
import { faClose } from "@fortawesome/pro-regular-svg-icons/faClose";
import { faSparkles } from "@fortawesome/pro-regular-svg-icons/faSparkles";
import { useEffect, useState } from "react";

// export const AIDrawer = () => {
//   const d1 = useEmbedDrawer("https://ai-assistant-dev.teamsystem.cloud/?embed=true&workspaceID=cbea971a-fa1a-41d1-8a6b-529659cd698c&agents=it_solutions%2Fsimple_answer_assistant&tenantID=&selector=false&useCustomLogin=true");

//   return (
//     <Box>
//       <Button variant="contained" size="small" onClick={d1.open}>Chiedilo all'assistente</Button>
//       <Button variant="contained" size="small" onClick={d1.close}>close drawer</Button>
//       {d1.el}
//     </Box>
//   );
// };

export const AIDrawer = () => {
  const applicationToken = useApplicationToken();

  useEffect(() => {
    if (window.copilotInit) {
      window.copilotInit({
        iframeId: 'il-copilot',
        appName: "demo",
        embedded: true,
        lang: "it",
        getToken: async () => {
          const token = await applicationToken.get();
          console.log({ TOKEN: token })
          if (!token) {
            throw new Error('Token di autenticazione non disponibile');
          }
          return token.applicationToken;
        },
        getWorkspaceId: () => "cbea971a-fa1a-41d1-8a6b-529659cd698c",
      });
    }
  }, [applicationToken]);

  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  const handleCloseDrawer = (): void => {
    setDrawerOpen(false);
  };
  return (
    <Box>
      <Button variant="contained" size="small" onClick={() => {setDrawerOpen(true)}}>Chiedilo all'assistente</Button>
    
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleCloseDrawer}
        // width="30vw"
        hideBackdrop={false}
        sx={{ "& .MuiDrawer-paperAnchorRight": { marginTop: "48px" } }}
      >
        <Title
          title="TS AI"
          leftItems={<Box sx={{ mr: '4px' }}><VaporIcon icon={faSparkles} size="xl" /></Box>}
          divider
          rightItems={[
            <IconButton size="small" variant='outlined' onClick={handleCloseDrawer}>
              <VaporIcon icon={faClose} size="xl" />
            </IconButton>
          ]}
        />
        <iframe
          id="il-copilot"
          src="https://ai-assistant-dev.teamsystem.cloud/?embed=true&title=false&workspaceID=cbea971a-fa1a-41d1-8a6b-529659cd698c&agents=it_solutions%2Fsimple_answer_assistant&tenantID=&selector=false&useCustomLogin=true"
          width="800"
          height="1000"
          title="My copilot iframe"
          style={{border: 'none'}}
        />
      </Drawer>
    </Box>
  );
}