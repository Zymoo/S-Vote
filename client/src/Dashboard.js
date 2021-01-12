import { Card, CardContent } from "@material-ui/core";
import { Title } from "react-admin";
import OrganizerForm from "./components/OrganizerForm";
import ShareHolderForm from "./components/ShareHolderForm";

// eslint-disable-next-line import/no-anonymous-default-export
export default ({ permissions }) => (
  <Card>
    <Title title="Dashboard" />
    <CardContent>Voting configuration</CardContent>
    {permissions && permissions.includes("ROLE_ORGANIZER") ? (
      <CardContent>
        <OrganizerForm />
      </CardContent>
    ) : null}
    {permissions && permissions.includes("ROLE_SHAREHOLDER") ? (
            <CardContent>
            <ShareHolderForm />
          </CardContent>
    ) : null}
  </Card>
);
