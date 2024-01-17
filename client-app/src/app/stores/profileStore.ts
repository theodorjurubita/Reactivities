import { makeAutoObservable, reaction, runInAction } from "mobx";
import { Photo, Profile, UserActivity } from "../models/profile";
import agent from "../api/agent";
import { store } from "./store";

export default class ProfileStore {
    profile: Profile | null = null;
    loadingProfile = false;
    uploading = false;
    loading = false;
    followings: Profile[] = [];
    loadingFollowings = false;
    activeTab = 0;
    userActivities: UserActivity[] = [];
    loadingActivities = false;

    constructor() {
        makeAutoObservable(this);

        reaction(() => this.activeTab,
            activeTab => {
                if (activeTab === 3 || activeTab === 4) {
                    var predicate = activeTab === 3 ? 'followers' : 'following';
                    this.listFollowings(predicate);
                }
                else {
                    this.followings = [];
                }
            });
    }

    get getProfile() {
        return this.profile;
    }

    get isCurrentUser() {
        if (store.userStore.user && this.profile) {
            return store.userStore.user.userName === this.profile.username;
        }
        return false;
    }

    setActiveTab = (activeTab: any) => {
        this.activeTab = activeTab;
    }

    loadProfile = async (username: string) => {
        this.loadingProfile = true;
        try {
            const profile = await agent.Profiles.get(username);
            runInAction(() => {
                this.profile = profile
                this.loadingProfile = false;
            });
        } catch (error) {
            console.log(error);
            runInAction(() => this.loadingProfile = false);
        }
    }

    uploadPhoto = async (file: Blob) => {
        this.uploading = true;
        try {
            const response = await agent.Profiles.uploadPhoto(file);
            const photo = response.data;
            runInAction(() => {
                if (this.profile) {
                    this.profile.photos?.push(photo);
                    if (photo.isMain && store.userStore.user) {
                        store.userStore.setImage(photo.url);
                        this.profile.image = photo.url;
                    }
                }
                this.uploading = false;
            });
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.uploading = false;
            });
        }
    }

    setMainPhoto = async (photo: Photo) => {
        this.loading = true;
        try {
            await agent.Profiles.setMainPhoto(photo.id);
            store.userStore.setImage(photo.url);
            runInAction(() => {
                if (this.profile && this.profile.photos) {
                    this.profile.photos.find(p => p.isMain)!.isMain = false;
                    this.profile.photos.find(p => p.id === photo.id)!.isMain = true;
                    this.profile.image = photo.url;
                    this.loading = false;
                }
            })
        } catch (error) {
            runInAction(() => {
                this.loading = false;
            })
            console.log(error);
        }
    }

    deletePhoto = async (id: string) => {
        this.loading = true;
        try {
            await agent.Profiles.deletePhoto(id);
            runInAction(() => {
                if (this.profile) {
                    this.profile.photos = this.profile.photos?.filter(p => p.id !== id);
                    this.loading = false;
                }
            })
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            })
        }
    }

    updateFollowing = async (username: string, following: boolean) => {
        this.loading = true;
        try {
            await agent.Profiles.updateFollowing(username);
            store.activityStore.updateAttendeeFollowing(username);
            runInAction(() => {
                if (this.profile && this.profile.username !== store.userStore.user?.userName && this.profile.username === username) {
                    following ? this.profile.followersCount++ : this.profile.followersCount--;
                    this.profile.following = !this.profile.following;
                }

                if (this.profile && this.profile.username === store.userStore.user?.userName) {
                    following ? this.profile.followingCount++ : this.profile.followingCount--;
                }

                this.followings.forEach(profileFollowing => {
                    if (profileFollowing.username === username) {
                        profileFollowing.following ? profileFollowing.followersCount-- : profileFollowing.followersCount++;
                        profileFollowing.following = !profileFollowing.following;
                    }
                });
                this.loading = false;
            })
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            })
        }
    };

    listFollowings = async (predicate: string) => {
        this.loadingFollowings = true;
        try {
            var followings = await agent.Profiles.listFollowings(this.profile!.username, predicate);
            runInAction(() => {
                this.followings = followings;
                this.loadingFollowings = false;
            });

        } catch (error) {
            console.log(error);
            runInAction(() => this.loadingFollowings = false);
        }
    }

    loadUserActivities = async (username: string, predicate: string) => {
        this.loadingActivities = true;
        try {
            const userActivities = await agent.Profiles.getActivities(username, predicate);
            runInAction(() => {
                this.userActivities = userActivities;
                this.loadingActivities = false;
            });
        } catch (error) {
            console.log(error);
            runInAction(() => this.loadingActivities = false);
        }
    }
}