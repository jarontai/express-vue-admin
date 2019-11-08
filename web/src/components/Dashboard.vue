<template>
  <Row type="flex" justify="space-around">
    <Col span="5" class="dash-row">
      <Card>
        <p slot="title">Welcome</p>
        <p>Welcome, user <b>{{ userInfo.username }}</b></p>
        <p>&nbsp;</p>
        <p>&nbsp;</p>
        <p>&nbsp;</p>
        <p>&nbsp;</p>
      </Card>
    </Col>

    <Col span="5">
      <Card>
        <p slot="title">Your Roles</p>
        <p v-for="role in roles" :key="role">{{ role }}</p>
        <p>&nbsp;</p>
        <p>&nbsp;</p>
        <p>&nbsp;</p>
      </Card>
    </Col>

    <Col span="5">
      <Card>
        <p slot="title">Your Permissions</p>
        <p v-for="permission in permissions" :key="permission">{{ permission }}</p>
      </Card>
    </Col>

    <Col span="5">
      <Card>
        <p slot="title">Todos</p>
        <p>TODO1</p>
        <p>TODO2</p>
        <p>TODO3</p>
        <p>&nbsp;</p>
        <p>&nbsp;</p>
      </Card>
    </Col>
  </Row>
</template>

<script>
export default {
  data() {
    return {
      userInfo: this.$store.state.user ? this.$store.state.user.userInfo : {},
      roles: this.$store.state.user ? this.$store.state.user.roles : [],
      permissions: this.$store.state.user ? this.$store.state.user.permissions : []
    };
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
