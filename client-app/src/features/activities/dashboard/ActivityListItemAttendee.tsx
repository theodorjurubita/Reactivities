import { observer } from "mobx-react-lite";
import { Image, List, Popup, PopupContent } from "semantic-ui-react";
import { Profile } from "../../../app/models/profile";
import { Link } from "react-router-dom";
import ProfileCard from "../../profiles/ProfileCard";

interface Props {
  attendees: Profile[];
}

export default observer(function ActivityListItemAttendee({
  attendees,
}: Props) {
  const styles = {
    borderColor: "orange",
    borderWidth: 2,
  };

  return (
    <List horizontal>
      {attendees.map((attendee) => {
        return (
          <Popup
            key={attendee.username}
            hoverable
            trigger={
              <List.Item
                key={attendee.username}
                as={Link}
                to={`/profiles/${attendee.username}`}
              >
                <Image
                  size="mini"
                  circular
                  bordered
                  style={attendee.following ? styles : null}
                  src={attendee.image || "/assets/user.png"}
                />
              </List.Item>
            }
          >
            <PopupContent>
              <ProfileCard profile={attendee}></ProfileCard>
            </PopupContent>
          </Popup>
        );
      })}
    </List>
  );
});
