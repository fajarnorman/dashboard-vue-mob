<template>
    <div>
        <div v-if="type == 'date'">
            <div class="lineNormal" v-if="conditions">{{value | moment("YYYY-MM-DD, H:mm:ss")}}</div>
            <div class="lineNormal" v-else>-</div>
        </div>
        <div v-else-if="type == 'meter'">
            <div class="lineNormal" v-if="conditions">{{value}}<sup>2</sup></div>
            <div class="lineNormal" v-else>-</div>
        </div>
        <div v-else-if="type == 'date-no-time'">
            <div class="lineNormal" v-if="conditions">{{value | moment("YYYY-MM-DD")}}</div>
            <div class="lineNormal" v-else>-</div>
        </div>
        <div v-else>
            <div class="lineNormal" v-if="conditions">{{value}}</div>
            <div class="lineNormal" v-else>-</div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'value-component',
    props: ['conditions', 'value', 'type'],
}
</script>

<style lang="scss" scoped>
.lineNormal{
    line-height: normal;
}
</style>
