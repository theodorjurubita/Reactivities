import { observer } from "mobx-react-lite";
import {
  Card,
  Grid,
  GridColumn,
  Header,
  Tab,
  Image,
  TabProps,
} from "semantic-ui-react";
import { useStore } from "../../app/stores/store";
import { format } from "date-fns";
import { SyntheticEvent, useEffect } from "react";
import { UserActivity } from "../../app/models/profile";
import { Link } from "react-router-dom";

const panes = [
  { menuItem: "Future Events", pane: { key: "future" } },
  { menuItem: "Past Events", pane: { key: "past" } },
  { menuItem: "Hosting", pane: { key: "hosting" } },
];

export default observer(function ProfileActivities() {
  const {
    profileStore: {
      loadUserActivities,
      profile,
      loadingActivities,
      userActivities,
    },
  } = useStore();

  useEffect(() => {
    loadUserActivities(profile!.username, "");
  }, [loadUserActivities, profile]);

  const handleTabChange = (e: SyntheticEvent, data: TabProps) => {
    loadUserActivities(
      profile!.username,
      panes[data.activeIndex as number].pane.key
    );
  };

  return (
    <Tab.Pane loading={loadingActivities}>
      <Grid>
        <GridColumn width={16}>
          <Header floated="left" icon="calendar" content="Activities" />
        </GridColumn>
        <GridColumn width={16}>
          <Tab
            menu={{ secondary: true, pointing: true }}
            panes={panes}
            onTabChange={(e, data) => handleTabChange(e, data)}
          />
          <br />
          <Card.Group itemsPerRow={4}>
            {userActivities.map((userActivity: UserActivity) => (
              <Card
                as={Link}
                to={`/activities/${userActivity.id}`}
                key={userActivity.id}
              >
                <Image
                  src={`/assets/categoryImages/${userActivity.category}.jpg`}
                  fluid
                  style={{ minHeight: 100, objectFit: "cover" }}
                />
                <Card.Content>
                  <Card.Header textAlign="center">
                    {userActivity.title}
                  </Card.Header>
                  <Card.Description>
                    <div>{format(new Date(userActivity.date), "do LLL")}</div>
                    <div>{format(new Date(userActivity.date), "h:mm a")}</div>
                  </Card.Description>
                </Card.Content>
              </Card>
            ))}
          </Card.Group>
        </GridColumn>
      </Grid>
    </Tab.Pane>
  );
});
